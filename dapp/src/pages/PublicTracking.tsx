import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  ExternalLink,
  Globe,
  Satellite,
  FileText,
  Clock,
  Sparkles,
  QrCode,
  ArrowLeft,
  Building2,
  Languages
} from 'lucide-react';
import { fetchBatchFromBackend, parseEvidenceHash, BatchResponse, BACKEND_BASE_URL } from '../services/backendApi';

export function PublicTracking() {
  const { batch_id } = useParams<{ batch_id: string }>();
  const navigate = useNavigate();

  const currentBatchId = batch_id || 'BATCH-LAO-001';
  const [searchInput, setSearchInput] = useState<string>(currentBatchId);
  const [batchData, setBatchData] = useState<BatchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchBatchFromBackend(currentBatchId)
      .then((data) => {
        if (isMounted) {
          setBatchData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching batch:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentBatchId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Find EUDR log if present
  const eudrLog = batchData?.data.logs?.find((l) => l.verifier === 'AI_EUDR_Engine');

  // Find OCR log if present
  const ocrLog = batchData?.data.logs?.find((l) => l.verifier === 'AI_CrossBorder_OCR');
  const parsedOcrEvidence = ocrLog ? parseEvidenceHash(ocrLog.evidence_hash) : null;

  const currentUrl = window.location.href;

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '10px 0 40px 0' }}>

      {/* Top Navigation & Search Header */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #d5dfce',
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '20px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#153826',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '12.5px',
                background: '#edf2e7',
                padding: '5px 10px',
                borderRadius: '6px'
              }}
            >
              <ArrowLeft size={14} />
              <span>ໜ້າລົງທະບຽນ</span>
            </Link>
            <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#153826', margin: 0 }}>
              ກວດສອບສະຖານະສິນຄ້າ (Public Traceability)
            </h1>
          </div>

          {/* Backend Status indicator */}
          <div style={{ fontSize: '11.5px', fontWeight: 700 }}>
            {batchData?.isMockFallback ? (
              <span style={{ color: '#b45309', background: '#fefce8', padding: '4px 10px', borderRadius: '6px', border: '1px solid #fde047' }}>
                🟡 ສະແດງຜົນຕົວຢ່າງ (Offline Fallback)
              </span>
            ) : (
              <span style={{ color: '#15803d', background: '#ecfdf5', padding: '4px 10px', borderRadius: '6px', border: '1px solid #86efac' }}>
                🟢 ເຊື່ອມຕໍ່ Go Backend (Port 4001) ແລ້ວ
              </span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="#4d6052" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ກອກລະຫັດລັອດ ເຊັ່ນ: BATCH-LAO-001..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px 10px 38px',
                border: '1.5px solid #d5dfce',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#142a1d'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 18px',
              background: '#153826',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            ຄົ້ນຫາ
          </button>
        </form>
      </div>

      {isLoading ? (
        <div style={{ background: '#ffffff', padding: '40px', textAlign: 'center', borderRadius: '8px', border: '1px solid #d5dfce' }}>
          <div style={{ fontSize: '14px', color: '#153826', fontWeight: 700 }}>ກຳລັງໂຫລດຂໍ້ມູນຈາກ Go Backend (Port 4001)...</div>
        </div>
      ) : !batchData?.data?.batch ? (
        <div style={{ background: '#ffffff', padding: '40px', textAlign: 'center', borderRadius: '8px', border: '1px solid #d5dfce' }}>
          <div style={{ fontSize: '16px', color: '#b45309', fontWeight: 800 }}>ບໍ່ພົບຂໍ້ມູນລັອດສິນຄ້າ: {currentBatchId}</div>
          <p style={{ fontSize: '13px', color: '#4d6052', marginTop: '6px' }}>ກະລຸນາກວດສອບລະຫັດລັອດ ຫຼື ລົງທະບຽນໃໝ່ທີ່ໜ້າ /register</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* 1. Master Batch Overview Card */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #153826',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 4px 14px rgba(21, 56, 38, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#4d6052', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ລະຫັດຊຸດສິນຄ້າ (BATCH ID)
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
                background: '#dcfce7',
                color: '#15803d',
                border: '1px solid #86efac',
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <ShieldCheck size={16} />
                <span>{batchData.data.batch.status}</span>
              </div>
            </div>

            {/* Owner & Smart Contract Anchor Info */}
            <div style={{
              background: '#edf4e8',
              border: '1px solid #d5dfce',
              borderRadius: '6px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              fontSize: '12px'
            }}>
              <div>
                <span style={{ color: '#4d6052', display: 'block', fontSize: '10.5px', fontWeight: 700 }}>
                  ກະເປົາຜູ້ຖືຄອງ (Batch Owner):
                </span>
                <span style={{ fontWeight: 800, color: '#153826', letterSpacing: '0.3px' }}>
                  {batchData.data.batch.owner}
                </span>
              </div>

              <a
                href={`https://explorer.labchain.la/address/${batchData.data.batch.owner}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#153826',
                  fontWeight: 800,
                  textDecoration: 'none',
                  background: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1'
                }}
              >
                <span>ກວດສອບບົນ LAB Chain (5222)</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* 2. Destination: Europe EUDR Section (Prominent Green Badge) */}
          {eudrLog && (
            <div style={{
              background: '#ffffff',
              border: '2px solid #16a34a',
              borderRadius: '8px',
              padding: '22px',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Satellite size={20} color="#15803d" />
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#142a1d', margin: 0 }}>
                    ກວດສອບດາວທຽມສະຫະພາບເອີຣົບ (EUDR Deforestation Verification)
                  </h3>
                </div>

                {/* Prominent Green Badge as per specification */}
                <div style={{
                  background: '#15803d',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 900,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(21, 128, 61, 0.25)'
                }}>
                  <span>✅ ປອດການຕັດໄມ້ທຳລາຍປ່າ (EUDR Compliant)</span>
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '14px', fontSize: '13px', color: '#166534' }}>
                <div style={{ fontWeight: 800, marginBottom: '4px' }}>
                  {eudrLog.action}
                </div>
                <div style={{ fontSize: '12px', color: '#15803d', display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
                  <div>
                    <strong>Evidence Hash:</strong> <span style={{ letterSpacing: '0.3px' }}>{eudrLog.evidence_hash}</span>
                  </div>
                  <div>
                    <strong>ເວລາຢັ້ງຢືນ:</strong> {eudrLog.timestamp}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Destination: China Customs OCR & Translation Section */}
          {ocrLog && (
            <div style={{
              background: '#ffffff',
              border: '2px solid #b45309',
              borderRadius: '8px',
              padding: '22px',
              boxShadow: '0 4px 12px rgba(180, 83, 9, 0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Languages size={20} color="#b45309" />
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#142a1d', margin: 0 }}>
                    AI Cross-Border OCR & ແປພາສາຈີນ GACC (China Customs Clearance)
                  </h3>
                </div>

                <span style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fde68a',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 800
                }}>
                  🇨🇳 ສປ ຈີນ (China GACC Ready)
                </span>
              </div>

              {/* Parsed Chinese & English Names from evidence_hash */}
              {parsedOcrEvidence?.product_name && (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '6px',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '14px',
                  marginBottom: '14px'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 800, display: 'block', marginBottom: '3px' }}>
                      🇨🇳 ຊື່ສິນຄ້າພາສາຈີນ (Chinese Translated Name):
                    </span>
                    <strong style={{ fontSize: '18px', color: '#b45309', fontWeight: 900 }}>
                      {parsedOcrEvidence.product_name.zh || '新鲜阿拉比卡咖啡豆'}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 800, display: 'block', marginBottom: '3px' }}>
                      🇬🇧 ຊື່ສິນຄ້າພາສາອັງກິດ (English Trade Name):
                    </span>
                    <strong style={{ fontSize: '15px', color: '#142a1d', fontWeight: 800 }}>
                      {parsedOcrEvidence.product_name.en || 'Fresh Arabica Coffee Beans'}
                    </strong>
                  </div>
                </div>
              )}

              <div style={{ fontSize: '12px', color: '#78350f', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <strong>ສະຖານະ:</strong> {ocrLog.action}
                </div>
                <div>
                  <strong>ເວລາສະແກນ AI:</strong> {ocrLog.timestamp}
                </div>
              </div>
            </div>
          )}

          {/* 4. Complete Audit Trail Logs */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #d5dfce',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Clock size={16} color="#153826" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#142a1d', margin: 0 }}>
                ບັນທຶກປະຫວັດການກວດສອບ (AI & Blockchain Audit Logs)
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {batchData.data.logs?.map((log, index) => (
                <div
                  key={index}
                  style={{
                    background: '#edf4e8',
                    border: '1px solid #d5dfce',
                    borderRadius: '6px',
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        background: '#153826',
                        color: 'white',
                        fontSize: '10.5px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}>
                        {log.verifier}
                      </span>
                      <strong style={{ fontSize: '13px', color: '#142a1d' }}>{log.action}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#4d6052', marginTop: '4px' }}>
                      Evidence: <code style={{ color: '#153826', background: 'rgba(255,255,255,0.7)', padding: '2px 4px', borderRadius: '4px' }}>{log.evidence_hash.substring(0, 48)}...</code>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#708375' }}>
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. QR Code Sharing Footer */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #d5dfce',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #153826',
                padding: '6px',
                borderRadius: '6px'
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(currentUrl)}`}
                  alt="Batch QR"
                  style={{ width: '80px', height: '80px', display: 'block' }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#153826' }}>
                  QR Code ສຳລັບກວດສອບລັອດນີ້
                </div>
                <div style={{ fontSize: '12px', color: '#4d6052', marginTop: '2px' }}>
                  ສາມາດສະແກນດ້ວຍໂທລະສັບມືຖືເພື່ອເບິ່ງໜ້ານີ້ໄດ້ທັນທີ
                </div>
              </div>
            </div>

            <Link
              to="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#153826',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '13px',
                padding: '10px 18px',
                borderRadius: '6px'
              }}
            >
              <span>+ ລົງທະບຽນລັອດໃໝ່</span>
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
