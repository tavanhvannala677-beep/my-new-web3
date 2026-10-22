import { Contract, ContractRunner, Interface } from "ethers";

/**
 * Lao National Single Traceability Platform Core Contract
 * Deployed on LAB Chain (Chain ID: 5222)
 */
export const LAO_TRACEABILITY_ADDRESS =
  (import.meta as any).env?.VITE_CONTRACT_ADDRESS || "0xee891fb89CaD3D643a029fF6b4BD0addc6E4d8Cc";

export enum TraceType {
  IdentityPreserved = 0, // ກາເຟ/ຢາງພາຣາ (Coffee / Rubber - Single Origin Farm GeoJSON)
  MassBalance = 1,       // ມັນຕົ້ນ/ອ້ອຍ (Cassava / Sugarcane - Batch Consolidation)
  IndividualTrace = 2    // ສັດລ້ຽງ (Livestock Ear Tag)
}

export enum BatchStatus {
  Registered = 0,    // ລົງທະບຽນແລ້ວ
  Processed = 1,     // ໂຮງງານແປຮູບແລ້ວ
  InTransit = 2,     // ກຳລັງຂົນສົ່ງ
  ExportCleared = 3, // ຜ່ານດ່ານສຸລະກາກອນແລ້ວ
  Rejected = 4       // ຖືກປະຕິເສດ
}

export const LAO_TRACEABILITY_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_batchId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_action",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_evidenceHash",
        "type": "string"
      },
      {
        "internalType": "enum LaoNationalTraceability.BatchStatus",
        "name": "_newStatus",
        "type": "uint8"
      }
    ],
    "name": "addVerificationLog",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "newBatchId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "targetFactory",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string[]",
        "name": "parentBatches",
        "type": "string[]"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "BatchMergedOrSplit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "batchId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "targetFactory",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum LaoNationalTraceability.TraceType",
        "name": "traceType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "BatchRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_batchId",
        "type": "string"
      },
      {
        "internalType": "enum LaoNationalTraceability.TraceType",
        "name": "_traceType",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "_productType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_quantity",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_offChainDataHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_targetFactory",
        "type": "address"
      }
    ],
    "name": "registerBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_newBatchId",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "_parentBatches",
        "type": "string[]"
      },
      {
        "internalType": "string",
        "name": "_productType",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_newQuantity",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_newOffChainDataHash",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_targetFactory",
        "type": "address"
      }
    ],
    "name": "splitOrMergeBatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "batchId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "verifier",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "action",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "VerificationAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "authorizedOperators",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "authorizedVerifiers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_batchId",
        "type": "string"
      }
    ],
    "name": "getBatch",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "batchId",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "targetFactory",
            "type": "address"
          },
          {
            "internalType": "enum LaoNationalTraceability.TraceType",
            "name": "traceType",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "productType",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "quantity",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "offChainDataHash",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "parentBatches",
            "type": "string[]"
          },
          {
            "internalType": "enum LaoNationalTraceability.BatchStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct LaoNationalTraceability.Batch",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_batchId",
        "type": "string"
      }
    ],
    "name": "getBatchLogs",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "verifier",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "action",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "evidenceHash",
            "type": "string"
          }
        ],
        "internalType": "struct LaoNationalTraceability.VerificationLog[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "superAdmin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const laoTraceabilityInterface = new Interface(LAO_TRACEABILITY_ABI);

export function getLaoTraceabilityContract(
  runner: ContractRunner,
  address: string = LAO_TRACEABILITY_ADDRESS
): Contract {
  return new Contract(address, LAO_TRACEABILITY_ABI, runner);
}

export interface OnChainBatch {
  batchId: string;
  operator: string;
  targetFactory: string;
  traceType: number;
  productType: string;
  quantity: bigint;
  offChainDataHash: string;
  parentBatches: string[];
  status: number;
  createdAt: bigint;
}

export interface OnChainVerificationLog {
  verifier: string;
  action: string;
  timestamp: bigint;
  evidenceHash: string;
}
