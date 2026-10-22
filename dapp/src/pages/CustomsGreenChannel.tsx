import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  Camera,
  CheckCircle2,
  FileCheck,
  TrainTrack,
  ArrowRight,
  ExternalLink,
  Satellite,
  Languages,
  Clock,
  AlertTriangle,
  QrCode,
  Sparkles
} from 'lucide-react';
import { fetchBatchFromBackend, runCustomsClearance, parseEvidenceHash, BatchResponse, BACKEND_BASE_URL } from '../services/backendApi';

export function CustomsGreenChannel() {
  // Step 1: Input / Scan State
  const [activeTab, setActiveTab] = useState<'manual' | 'camera'>('manual');
  const [inputBatchId, setInputBatchId] = useState<string>('BATCH-LAO-001');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraScanProgress, setCameraScanProgress] = useState<number>(0);

  // Loaded Batch State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [batchData, setBatchData] = useState<BatchResponse | null>(null);

  // Step 2: Approval State
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [approvalResult, setApprovalResult] = useState<any>(null);

  // Fetch batch details on load or submission
  const loadBatch = async (id: string) => {
    setIsLoading(true);
    setApprovalResult(null);
    try {
      const data = await fetchBatchFromBackend(id.trim());
      setBatchData(data);
    } catch (e) {
      console.error('Error fetching batch:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBatch(inputBatchId);
  }, []);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputBatchId.trim()) {
      loadBatch(inputBatchId.trim());
    }
  };

  // Camera Simulation for Demo
  const startCameraScan = () => {
    setIsCameraActive(true);
    setCameraScanProgress(0);

    const interval = setInterval(() => {
      setCameraScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCameraActive(false);
          setInputBatchId('FACTORY-001');
          loadBatch('FACTORY-001');
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Step 2: Approve Customs Clearance
  const handleApproveClearance = async () => {
    if (!batchData?.data.batch.batch_id) return;

    setIsApproving(true);
    const payload = {
      batch_id: batchData.data.batch.batch_id,
      action: "GACC_CLEARED_GREEN_CHANNEL",
      evidence_hash: "Customs Officer Verified #8812 - Mohan/Boten Border Control"
    };

    const res = await runCustomsClearance(payload);
    setIsApproving(false);

    if (res.success) {
      setApprovalResult({
        approvedAt: new Date().toISOString(),
        officer: 'GACC Mohan Officer #8812 & Boten Customs Node',
        trainNo: 'Lao-China Railway Cargo LX-802',
        sealId: 'TGHU-992140-7'
      });
      // Refresh batch view
      loadBatch(batchData.data.batch.batch_id);
    }
  };

  const eudrLog = batchData?.data.logs?.find(l => l.verifier === 'AI_EUDR_Engine');
  const ocrLog = batchData?.data.logs?.find(l => l.verifier === 'AI_CrossBorder_OCR');
  const parsedOcr = ocrLog ? parseEvidenceHash(ocrLog.evidence_hash) : null;
  const isAlreadyCleared = batchData?.data.batch.status === 'GACC_CLEARED_GREEN_CHANNEL' || Boolean(approvalResult);

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '10px 0 40px 0' }}>

      {/* Top Banner & Header */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #d5dfce',
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>👮‍♂️</span>
            <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#153826', margin: 0 }}>
              4. ໜ້າດ່ານສຸລະກາກອນ (Customs Green Channel) — ກວດປ່ອຍສິນຄ້າດ່ວນ
            </h1>
          </div>
          <p style={{ fontSize: '12.5px', color: '#4d6052', margin: '4px 0 0 0' }}>
            ດ່ານສາກົນ ບໍ່ເຕັນ (LA) ⇌ ໂມ່ຫານ (CN) • ອະນຸມັດປ່ອຍຜ່ານຂະບວນລົດໄຟ ລາວ-ຈີນ
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#eaf1e5',
            color: '#153826',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: 800
          }}>
            <TrainTrack size={14} color="#15803d" />
            Lao-China Rail Green Channel
          </span>
          <Link
            to={`/track/${encodeURIComponent(inputBatchId)}`}
            style={{
              color: '#153826',
              textDecoration: 'none',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 12px',
              background: '#ffffff',
              border: '1px solid #d5dfce',
              borderRadius: '6px'
            }}
          >
            <span>ເບິ່ງໜ້າ Track ຜູ້ບໍລິໂພກ</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* STEP 1: Dual Input/Scan Methods (Manual & Camera) as in brief */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #d5dfce',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '22px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#153826' }}>
            ຂັ້ນຕອນທີ 1: ເລືອກວິທີດຶງຂໍ້ມູນສິນຄ້າ (Step 1: Input / Scan & Fetch)
          </div>

          {/* Toggle between Manual and Camera */}
          <div style={{ display: 'flex', background: '#edf2e7', padding: '3px', borderRadius: '6px', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              style={{
                padding: '6px 14px',
                borderRadius: '4px',
                border: 'none',
                background: activeTab === 'manual' ? '#ffffff' : 'transparent',
                color: activeTab === 'manual' ? '#153826' : '#4d6052',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: activeTab === 'manual' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              ⌨️ ພິມກອກລະຫັດ (Manual Input)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('camera')}
              style={{
                padding: '6px 14px',
                borderRadius: '4px',
                border: 'none',
                background: activeTab === 'camera' ? '#ffffff' : 'transparent',
                color: activeTab === 'camera' ? '#153826' : '#4d6052',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: activeTab === 'camera' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <Camera size={13} />
              <span>📷 ເປີດກ້ອງສະແກນ QR Code</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Manual Input (from Manifest document) */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <input
                type="text"
                value={inputBatchId}
                onChange={(e) => setInputBatchId(e.target.value)}
                placeholder="ກອກເລກທີເອກະສານ Manifest ຫຼື Batch ID ເຊັ່ນ: BATCH-LAO-001..."
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '11px 14px',
                  borderRadius: '6px',
                  border: '1.5px solid #d5dfce',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  color: '#153826',
                  letterSpacing: '0.3px'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '11px 22px',
                background: '#153826',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Search size={16} />
              <span>ດຶງຂໍ້ມູນກວດສອບ (GET /batch/:id)</span>
            </button>

            {/* Quick Manifest Samples */}
            <div style={{ width: '100%', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
              <span style={{ fontSize: '11.5px', color: '#708375', fontWeight: 700 }}>ຕົວຢ່າງເອກະສານດ່ານ:</span>
              <button
                type="button"
                onClick={() => { setInputBatchId('BATCH-LAO-001'); loadBatch('BATCH-LAO-001'); }}
                style={{ padding: '3px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #d5dfce', background: '#f8fafc', cursor: 'pointer', fontWeight: 700 }}
              >
                BATCH-LAO-001 (EU Arabica)
              </button>
              <button
                type="button"
                onClick={() => { setInputBatchId('FACTORY-001'); loadBatch('FACTORY-001'); }}
                style={{ padding: '3px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #d5dfce', background: '#f8fafc', cursor: 'pointer', fontWeight: 700 }}
              >
                FACTORY-001 (Merged China Cargo)
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Camera QR Scanner Simulation */}
        {activeTab === 'camera' && (
          <div style={{
            background: '#0f172a',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
            color: '#f8fafc'
          }}>
            {!isCameraActive ? (
              <div>
                <QrCode size={40} color="#38bdf8" style={{ margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>
                  ເຄື່ອງສະແກນ QR Code ຕູ້ຄອນເທນເນີ
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', maxWidth: '360px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
                  ກົດປຸ່ມດ້ານລຸ່ມເພື່ອເປີດກ້ອງສະແກນ QR Code ທີ່ຕິດຢູ່ຕູ້ສິນຄ້າ ຫຼື ປ້າຍ Manifest.
                </p>
                <button
                  type="button"
                  onClick={startCameraScan}
                  style={{
                    padding: '10px 24px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Camera size={16} />
                  <span>ເປີດກ້ອງສະແກນດຽວນີ້</span>
                </button>
              </div>
            ) : (
              <div style={{ padding: '20px 0' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#38bdf8', marginBottom: '8px' }}>
                  ກຳລັງຈັບຈຸດ QR Code... {cameraScanProgress}%
                </div>
                <div style={{ width: '220px', height: '6px', background: '#1e293b', borderRadius: '4px', margin: '0 auto 12px auto', overflow: 'hidden' }}>
                  <div style={{ width: `${cameraScanProgress}%`, height: '100%', background: '#38bdf8', transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                  ລັອກເປົ້າໝາຍຕູ້ຄອນເທນເນີ FACTORY-001...
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Batch Inspection Details Display */}
      {isLoading ? (
        <div style={{ background: '#ffffff', padding: '36px', textAlign: 'center', borderRadius: '8px', border: '1px solid #d5dfce' }}>
          <div style={{ fontSize: '14px', color: '#153826', fontWeight: 800 }}>ກຳລັງກວດສອບກັບລະບົບ e-Customs & Go Backend...</div>
        </div>
      ) : batchData?.data?.batch ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Batch Header Overview */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #153826',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(21, 56, 38, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#4d6052', fontWeight: 800, textTransform: 'uppercase' }}>
                  ໝາຍເລກລັອດທີ່ກວດພົບ (VERIFIED BATCH)
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#153826', margin: '2px 0 0 0', letterSpacing: '0.5px' }}>
                  {batchData.data.batch.batch_id}
                </h2>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#142a1d', marginTop: '4px' }}>
                  {batchData.data.batch.product_name}
                </div>
              </div>

              {/* Status Badge */}
              <div style={{
                background: isAlreadyCleared ? '#dcfce7' : '#fef3c7',
                color: isAlreadyCleared ? '#15803d' : '#92400e',
                border: `1.5px solid ${isAlreadyCleared ? '#86efac' : '#fde68a'}`,
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <ShieldCheck size={16} />
                <span>{isAlreadyCleared ? 'GACC_CLEARED_GREEN_CHANNEL' : batchData.data.batch.status}</span>
              </div>
            </div>

            {/* Grid of Key Metadata */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              background: '#edf4e8',
              padding: '14px',
              borderRadius: '6px',
              border: '1px solid #d5dfce',
              fontSize: '12.5px'
            }}>
              <div>
                <span style={{ color: '#4d6052', display: 'block', fontSize: '11px', fontWeight: 700 }}>ເຈົ້າຂອງສິນຄ້າ (Owner):</span>
                <strong style={{ color: '#142a1d' }}>{batchData.data.batch.owner}</strong>
              </div>

              <div>
                <span style={{ color: '#4d6052', display: 'block', fontSize: '11px', fontWeight: 700 }}>ແຫຼ່ງທີ່ມາ / ສະຖານທີ່:</span>
                <strong style={{ color: '#142a1d' }}>{batchData.data.batch.farm_location || 'ປາກຊ່ອງ, ຈຳປາສັກ'}</strong>
              </div>

              {batchData.data.batch.quantity && (
                <div>
                  <span style={{ color: '#4d6052', display: 'block', fontSize: '11px', fontWeight: 700 }}>ນ້ຳໜັກລວມ (Weight):</span>
                  <strong style={{ color: '#059669' }}>{batchData.data.batch.quantity.toLocaleString()} kg</strong>
                </div>
              )}

              {batchData.data.batch.parent_batches && (
                <div>
                  <span style={{ color: '#4d6052', display: 'block', fontSize: '11px', fontWeight: 700 }}>ລັອດຕົ້ນທາງ:</span>
                  <strong style={{ color: '#0284c7' }}>{batchData.data.batch.parent_batches.join(', ')}</strong>
                </div>
              )}
            </div>
          </div>

          {/* AI Pre-Checks: EUDR Satellite & GACC OCR Proofs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>

            {/* EUDR Deforestation Card */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #86efac',
              borderRadius: '8px',
              padding: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Satellite size={18} color="#15803d" />
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#15803d', margin: 0 }}>
                  ໃບຢັ້ງຢືນດາວທຽມ EUDR ບໍ່ຕັດໄມ້ທຳລາຍປ່າ
                </h4>
              </div>
              <div style={{ fontSize: '12px', color: '#166534', lineHeight: 1.5 }}>
                {eudrLog ? (
                  <>
                    <div style={{ fontWeight: 800, color: '#15803d', marginBottom: '4px' }}>
                      ✅ ຜ່ານການວິເຄາະ Sentinel-2 (NDVI: 0.86)
                    </div>
                    <div>Cutoff date: 31/12/2020 ຜ່ານເກນ 100%</div>
                    <div style={{ fontSize: '11px', color: '#4d6052', marginTop: '4px' }}>
                      Hash: {eudrLog.evidence_hash}
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#65a30d' }}>
                    ✅ ກວດສອບພື້ນທີ່ປ່າໄມ້ຜ່ານເກນ EUDR
                  </div>
                )}
              </div>
            </div>

            {/* China GACC Translation Card */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #fde68a',
              borderRadius: '8px',
              padding: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Languages size={18} color="#b45309" />
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#b45309', margin: 0 }}>
                  ໃບສຸຂານາໄມພືດແປພາສາຈີນ GACC
                </h4>
              </div>
              <div style={{ fontSize: '12px', color: '#78350f', lineHeight: 1.5 }}>
                <div>ຊື່ພາສາຈີນ: <strong style={{ fontSize: '15px', color: '#92400e' }}>{parsedOcr?.product_name?.zh || '新鲜阿拉比卡咖啡豆'}</strong></div>
                <div>ຊື່ອັງກິດ: <strong>{parsedOcr?.product_name?.en || 'Fresh Arabica Coffee Beans'}</strong></div>
                <div style={{ fontSize: '11px', color: '#a16207', marginTop: '4px' }}>
                  GACC Mohan Port Code: 5300 / Mohan-Boten Express
                </div>
              </div>
            </div>

          </div>

          {/* STEP 2: Big Green Approval Button (MANDATORY in brief) */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #15803d',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 6px 20px rgba(21, 128, 61, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#153826', margin: '0 0 6px 0' }}>
              ຂັ້ນຕອນທີ 2: ຢືນຢັນການກວດປ່ອຍຜ່ານດ່ານສາກົນ (Step 2: Customs Clearance Approval)
            </h3>
            <p style={{ fontSize: '12.5px', color: '#4d6052', margin: '0 auto 18px auto', maxWidth: '520px' }}>
              ເມື່ອຂໍ້ມູນຖືກຕ້ອງຄົບຖ້ວນ, ເຈົ້າໜ້າທີ່ຈະກົດປຸ່ມອະນຸມັດເພື່ອປະທັບຕາດິຈິຕອນ ແລະ ປົດລັອກຊ່ອງທາງດ່ວນ Green Channel ຂຶ້ນລົດໄຟ ລາວ-ຈີນ.
            </p>

            {isAlreadyCleared && (
              <div style={{
                background: '#ecfdf5',
                border: '1.5px solid #86efac',
                borderRadius: '6px',
                padding: '14px',
                maxWidth: '480px',
                margin: '0 auto 18px auto',
                fontSize: '12.5px',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}>
                <CheckCircle2 size={18} />
                <span>
                  <strong>ອະນຸມັດປ່ອຍຜ່ານດ່ານຮຽບຮ້ອຍແລ້ວ!</strong> (GACC Cleared)
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleApproveClearance}
              disabled={isApproving}
              style={{
                padding: '16px 36px',
                background: '#15803d',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 900,
                cursor: isApproving ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(21, 128, 61, 0.35)',
                transition: 'all 0.2s'
              }}
            >
              {isApproving ? (
                <span>ກຳລັງປະທັບຕາດິຈິຕອນ...</span>
              ) : (
                <>
                  <CheckCircle2 size={22} />
                  <span>✅ ອະນຸມັດຜ່ານດ່ານ (Approve Customs Clearance)</span>
                </>
              )}
            </button>
          </div>

        </div>
      ) : null}

    </div>
  );
}
