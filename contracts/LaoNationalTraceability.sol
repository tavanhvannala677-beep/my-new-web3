// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Lao National Single Traceability Platform Core Contract
 * @dev พัฒนาสำหรับ Labchain (EVM-compatible) รองรับระบบสินค้าเกษตร 3 รูปแบบ
 */
contract LaoNationalTraceability {

    // ==========================================
    // 1. Data Schema & Structs (โครงสร้างข้อมูล)
    // ==========================================

    // รองรับพฤติกรรมสินค้า 3 รูปแบบ
    enum TraceType { 
        IdentityPreserved, // กาแฟ/ยางพารา (ต้องเก็บพิกัดแปลงชัดเจน ห้ามปน)
        MassBalance,       // มันสำปะหลัง/อ้อย (ผสมล็อตได้ แต่ต้องเช็คสัดส่วน)
        IndividualTrace    // ปศุสัตว์/โคกระบือ (ติดตามรายตัวผ่าน Ear Tag)
    }

    enum BatchStatus { Registered, Processed, InTransit, ExportCleared, Rejected }

    // โครงสร้างบันทึกการตรวจสอบจากเจ้าหน้าที่หรือ AI
    struct VerificationLog {
        address verifier;       // กระเป๋าของเจ้าหน้าที่, ระบบ AI หรือด่าน GACC
        string action;          // เช่น "AI_EUDR_PASSED", "GACC_DOCUMENT_VERIFIED"
        uint256 timestamp;
        string evidenceHash;    // IPFS CID ของเอกสาร OCR, ใบ e-Phyto หรือภาพถ่ายดาวเทียม
    }

    // ชุดข้อมูลแกนกลางของล็อตสินค้า
    struct Batch {
        string batchId;           // รหัสล็อตสินค้า (Unique)
        address operator;         // เจ้าของล็อต / ชาวสวน / ลานรับซื้อ
        address targetFactory;    // จุดเชื่อมต่อ: ระบุกระเป๋าของโรงงานปลายทาง
        TraceType traceType;      // ประเภทการประเมินย้อนกลับ
        string productType;       // เช่น "Coffee_Bolaven", "Cassava_Starch"
        uint256 quantity;         // น้ำหนัก (kg) หรือ จำนวนตัว
        
        // **GAS OPTIMIZATION POINT**
        // แทนที่จะเก็บ JSON Polygon ยาวๆ เราเก็บแค่ IPFS CID (Hash) ของ GeoJSON
        string offChainDataHash;  
        
        string[] parentBatches;   // สำหรับ Mass Balance (เก็บประวัติล็อตต้นทางที่นำมาผสม)
        BatchStatus status;
        uint256 createdAt;
    }

    // ==========================================
    // State Variables & Mappings
    // ==========================================

    address public superAdmin;
    
    // จัดเก็บข้อมูล Batch และ Log ย้อนหลัง
    mapping(string => Batch) private batches;
    mapping(string => VerificationLog[]) private batchLogs;
    
    // ระบบจัดการสิทธิ์ (Role-based Access Control)
    mapping(address => bool) public authorizedOperators; // เกษตรกร/ลานรับซื้อที่ KYC แล้ว
    mapping(address => bool) public authorizedVerifiers; // เจ้าหน้าที่รัฐ / AI Oracle / ศุลกากร

    // ==========================================
    // Events (สำหรับให้ Frontend ดักจับข้อมูลไปแสดงผล)
    // ==========================================
    
    // เพิ่ม indexed targetFactory เพื่อให้หน้าเว็บโรงงานดึงเฉพาะล็อตของตัวเองได้
    event BatchRegistered(string indexed batchId, address indexed operator, address indexed targetFactory, TraceType traceType, uint256 timestamp);
    event BatchMergedOrSplit(string indexed newBatchId, address indexed operator, address indexed targetFactory, string[] parentBatches, uint256 timestamp);
    event VerificationAdded(string indexed batchId, address indexed verifier, string action, uint256 timestamp);

    // ==========================================
    // Modifiers
    // ==========================================
    modifier onlyAdmin() {
        require(msg.sender == superAdmin, "Not Super Admin");
        _;
    }

    modifier onlyOperator() {
        require(authorizedOperators[msg.sender] || msg.sender == superAdmin, "Not Authorized Operator");
        _;
    }

    modifier onlyVerifier() {
        require(authorizedVerifiers[msg.sender] || msg.sender == superAdmin, "Not Authorized Verifier");
        _;
    }

    constructor() {
        superAdmin = msg.sender;
    }

    // ==========================================
    // 2. Core Functions (ฟังก์ชันแกนกลาง)
    // ==========================================

    /**
     * @dev ลงทะเบียนล็อตสินค้าใหม่ (หน้าชาวสวน)
     */
    function registerBatch(
        string memory _batchId,
        TraceType _traceType,
        string memory _productType,
        uint256 _quantity,
        string memory _offChainDataHash,
        address _targetFactory      // รับค่ากระเป๋าโรงงานปลายทาง
    ) external onlyOperator {
        require(bytes(batches[_batchId].batchId).length == 0, "Batch ID already exists");

        // สร้าง Batch ใหม่
        batches[_batchId] = Batch({
            batchId: _batchId,
            operator: msg.sender,
            targetFactory: _targetFactory, // บันทึกโรงงานปลายทางลงเชน
            traceType: _traceType,
            productType: _productType,
            quantity: _quantity,
            offChainDataHash: _offChainDataHash,
            parentBatches: new string[](0),
            status: BatchStatus.Registered,
            createdAt: block.timestamp
        });

        emit BatchRegistered(_batchId, msg.sender, _targetFactory, _traceType, block.timestamp);
    }

    /**
     * @dev การรวมล็อตสินค้า (หน้าโรงงาน - Mass Balance)
     */
    function splitOrMergeBatch(
        string memory _newBatchId,
        string[] memory _parentBatches,
        string memory _productType,
        uint256 _newQuantity,
        string memory _newOffChainDataHash,
        address _targetFactory      // เผื่อโรงงานต้องการส่งต่อไปให้ท่าเรือ/ศุลกากร
    ) external onlyOperator {
        require(bytes(batches[_newBatchId].batchId).length == 0, "New Batch ID already exists");
        require(_parentBatches.length > 0, "Must provide parent batches");

        // ตรวจสอบว่า Parent Batches มีอยู่จริง
        for (uint256 i = 0; i < _parentBatches.length; i++) {
            require(bytes(batches[_parentBatches[i]].batchId).length != 0, "Parent batch not found");
        }

        // สร้าง Batch ใหม่ที่มีประวัติ Parent
        batches[_newBatchId] = Batch({
            batchId: _newBatchId,
            operator: msg.sender,
            targetFactory: _targetFactory,
            traceType: TraceType.MassBalance,
            productType: _productType,
            quantity: _newQuantity,
            offChainDataHash: _newOffChainDataHash,
            parentBatches: _parentBatches,
            status: BatchStatus.Processed,
            createdAt: block.timestamp
        });

        emit BatchMergedOrSplit(_newBatchId, msg.sender, _targetFactory, _parentBatches, block.timestamp);
    }

    /**
     * @dev เพิ่มประวัติการตรวจสอบ (ใช้โดย AI หรือเจ้าหน้าที่รัฐ)
     */
    function addVerificationLog(
        string memory _batchId,
        string memory _action,
        string memory _evidenceHash,
        BatchStatus _newStatus
    ) external onlyVerifier {
        require(bytes(batches[_batchId].batchId).length != 0, "Batch not found");

        // บันทึก Log การตรวจสอบ
        batchLogs[_batchId].push(VerificationLog({
            verifier: msg.sender,
            action: _action,
            timestamp: block.timestamp,
            evidenceHash: _evidenceHash
        }));

        // อัปเดตสถานะล่าสุดของ Batch
        batches[_batchId].status = _newStatus;

        emit VerificationAdded(_batchId, msg.sender, _action, block.timestamp);
    }

    // ==========================================
    // Getter Functions
    // ==========================================
    
    function getBatch(string memory _batchId) external view returns (Batch memory) {
        require(bytes(batches[_batchId].batchId).length != 0, "Batch not found");
        return batches[_batchId];
    }

    function getBatchLogs(string memory _batchId) external view returns (VerificationLog[] memory) {
        return batchLogs[_batchId];
    }
}
