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
  Languages,
  TrainTrack,
  MapPin,
  Layers
} from 'lucide-react';
import { fetchBatchFromBackend, parseEvidenceHash, BatchResponse, BACKEND_BASE_URL } from '../services/backendApi';

export function PublicTracking() {
  const params = useParams<{ id?: string; batch_id?: string }>();
  const navigate = useNavigate();

  const currentBatchId = params.id || params.batch_id || 'BATCH-LAO-001';
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

  // Check if customs cleared
  const isCustomsCleared = 
    batchData?.data.batch.status === 'GACC_CLEARED_GREEN_CHANNEL' ||
    batchData?.data.logs?.some(l => l.action.includes('CLEARED') || l.verifier === 'Customs_Inspector');

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
              to="/customs"
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
              <span>ໜ້າດ່ານສຸລະກາກອນ</span>
            </Link>
            <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#153826', margin: 0 }}>
              5. ຕິດຕາມສິນຄ້າສຳລັບຜູ້ບໍລິໂພກ (Consumer Track & Trace)
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
              placeholder="ກອກລະຫັດລັອດ ເຊັ່ນ: BATCH-LAO-001 ຫຼື FACTORY-001..."
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
            ຄົ້ນຫາ (GET)
          </button>
        </form>
      </div>

      {isLoading ? (
        <div style={{ background: '#ffffff', padding: '40px', textAlign: 'center', borderRadius: '8px', border: '1px solid #d5dfce' }}>
          <div style={{ fontSize: '14px', color: '#153826', fontWeight: 800 }}>ກຳລັງດຶງປະຫວັດສິນຄ້າຈາກ Go Backend (Port 4001)...</div>
        </div>
      ) : !batchData?.data?.batch ? (
        <div style={{ background: '#ffffff', padding: '40px', textAlign: 'center', borderRadius: '8px', border: '1px solid #d5dfce' }}>
          <div style={{ fontSize: '16px', color: '#b45309', fontWeight: 800 }}>ບໍ່ພົບຂໍ້ມູນລັອດສິນຄ້າ: {currentBatchId}</div>
          <p style={{ fontSize: '13px', color: '#4d6052', marginTop: '6px' }}>ກະລຸນາກວດສອບລະຫັດລັອດ ຫຼື ລົງທະບຽນໃໝ່ທີ່ໜ້າ /register</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* 1. Master Product Card */}
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

              {/* Status Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                {isCustomsCleared ? (
                  <div style={{
                    background: '#15803d',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontWeight: 900,
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(21, 128, 61, 0.3)'
                  }}>
                    <CheckCircle2 size={16} />
                    <span>✅ ຜ່ານດ່ານສຸລະກາກອນຮຽບຮ້ອຍ (GACC Cleared)</span>
                  </div>
                ) : (
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
                )}

                {eudrLog && (
                  <span style={{
                    background: '#f0fdf4',
                    color: '#15803d',
                    border: '1px solid #bbf7d0',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    ✅ ປອດການຕັດໄມ້ທຳລາຍປ່າ (EUDR Compliant)
                  </span>
                )}
              </div>
            </div>

            {/* Owner & Location Info */}
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
                  ເຈົ້າຂອງສິນຄ້າ / ຜູ້ຜະລິດ (Owner):
                </span>
                <span style={{ fontWeight: 800, color: '#153826' }}>
                  {batchData.data.batch.owner}
                </span>
              </div>

              {batchData.data.batch.farm_location && (
                <div>
                  <span style={{ color: '#4d6052', display: 'block', fontSize: '10.5px', fontWeight: 700 }}>
                    ແຫຼ່ງຜະລິດ:
                  </span>
                  <span style={{ fontWeight: 800, color: '#142a1d' }}>
                    {batchData.data.batch.farm_location}
                  </span>
                </div>
              )}

              <a
                href={`https://explorer.labchain.la`}
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
                <span>LAB Chain (5222) Verified</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Bilingual Chinese/English Translation Banner (if present) */}
          {parsedOcrEvidence?.product_name && (
            <div style={{
              background: '#fffbeb',
              border: '2px solid #fde68a',
              borderRadius: '8px',
              padding: '18px 22px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px'
            }}>
              <div>
                <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 800, display: 'block' }}>
                  🇨🇳 ຊື່ສິນຄ້າມາດຕະຖານດ່ານຈີນ (GACC Verified Translation):
                </span>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#b45309', marginTop: '2px' }}>
                  {parsedOcrEvidence.product_name.zh || '新鲜阿拉比卡咖啡豆'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 800, display: 'block' }}>
                  🇬🇧 International Trade Name:
                </span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#142a1d', marginTop: '2px' }}>
                  {parsedOcrEvidence.product_name.en || 'Fresh Arabica Coffee Beans'}
                </div>
              </div>
            </div>
          )}

          {/* 2. Upstream-to-Downstream Timeline UI (MANDATORY in brief) */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #d5dfce',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Clock size={18} color="#153826" />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#142a1d', margin: 0 }}>
                ເສັ້ນທາງການເດີນທາງຂອງສິນຄ້າ (Upstream to Downstream Timeline)
              </h3>
            </div>

            <div style={{ position: 'relative', paddingLeft: '28px' }}>

              {/* Vertical Timeline Track Line */}
              <div style={{
                position: 'absolute',
                left: '11px',
                top: '10px',
                bottom: '10px',
                width: '2px',
                background: '#c2cfba'
              }} />

              {/* Timeline Items */}
              {batchData.data.logs?.map((log, index) => {
                const isEudr = log.verifier === 'AI_EUDR_Engine';
                const isCustoms = log.verifier === 'Customs_Inspector' || log.action.includes('CLEARED');
                const isOcr = log.verifier === 'AI_CrossBorder_OCR';
                const isFactory = log.verifier === 'Factory_Portal';

                return (
                  <div key={index} style={{ position: 'relative', marginBottom: '22px' }}>

                    {/* Timeline Node Icon Pin */}
                    <div style={{
                      position: 'absolute',
                      left: '-28px',
                      top: '0px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isCustoms ? '#15803d' : isEudr ? '#16a34a' : isOcr ? '#b45309' : '#153826',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      zIndex: 2
                    }}>
                      <CheckCircle2 size={13} />
                    </div>

                    {/* Log Content Card */}
                    <div style={{
                      background: '#edf4e8',
                      border: '1px solid #d5dfce',
                      borderRadius: '6px',
                      padding: '14px 16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            background: isCustoms ? '#15803d' : isEudr ? '#16a34a' : isOcr ? '#b45309' : '#153826',
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {log.verifier}
                          </span>
                          <strong style={{ fontSize: '13.5px', color: '#142a1d' }}>
                            {log.action}
                          </strong>
                        </div>
                        <span style={{ fontSize: '11.5px', color: '#708375', fontWeight: 600 }}>
                          {log.timestamp}
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: '#4d6052', marginTop: '6px' }}>
                        <strong>ຫຼັກຖານດິຈິຕອນ (Evidence Hash):</strong>{' '}
                        <code style={{ background: '#ffffff', padding: '2px 6px', borderRadius: '4px', color: '#153826', border: '1px solid #d5dfce' }}>
                          {log.evidence_hash}
                        </code>
                      </div>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>

          {/* 3. QR Code & Fast Navigation Footer */}
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
                  QR Code ປະຈຳລັອດ: {batchData.data.batch.batch_id}
                </div>
                <div style={{ fontSize: '12px', color: '#4d6052', marginTop: '2px' }}>
                  ສາມາດສະແກນດ້ວຍໂທລະສັບມືຖືເພື່ອເບິ່ງໜ້ານີ້ໄດ້ທັນທີ
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Link
                to="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#edf2e7',
                  color: '#153826',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  padding: '9px 14px',
                  borderRadius: '6px',
                  border: '1px solid #d5dfce'
                }}
              >
                <span>+ ລົງທະບຽນໃໝ່</span>
              </Link>
              <Link
                to="/customs"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#153826',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  padding: '9px 16px',
                  borderRadius: '6px'
                }}
              >
                <span>ກວດປ່ອຍດ່ານສຸລະກາກອນ</span>
              </Link>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
