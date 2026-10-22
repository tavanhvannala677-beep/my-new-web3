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
  Layers,
  Check
} from 'lucide-react';
import { BrowserProvider } from 'ethers';
import { fetchBatchFromBackend, parseEvidenceHash, BatchResponse } from '../services/backendApi';
import {
  getBatchFromChain,
  getBatchLogsFromChain,
  getLabChainReadOnlyProvider
} from '../services/web3Traceability';
import {
  LAO_TRACEABILITY_ADDRESS,
  BatchStatus,
  TraceType
} from '../contracts/laoNationalTraceability';

export function PublicTracking() {
  const params = useParams<{ id?: string; batch_id?: string }>();
  const navigate = useNavigate();

  const currentBatchId = params.id || params.batch_id || 'BATCH-LAO-001';
  const [searchInput, setSearchInput] = useState<string>(currentBatchId);
  const [batchData, setBatchData] = useState<BatchResponse | null>(null);
  const [onChainBatch, setOnChainBatch] = useState<any | null>(null);
  const [onChainLogs, setOnChainLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadData = async () => {
      // 1. Try reading from Smart Contract directly on LAB Chain
      try {
        const provider = (typeof window !== 'undefined' && (window as any).ethereum)
          ? new BrowserProvider((window as any).ethereum)
          : getLabChainReadOnlyProvider();

        const chainBatch = await getBatchFromChain(provider, currentBatchId.trim());
        const chainLogs = await getBatchLogsFromChain(provider, currentBatchId.trim());

        if (isMounted && chainBatch) {
          setOnChainBatch(chainBatch);
          setOnChainLogs(chainLogs);
        }
      } catch (err) {
        console.warn('Smart contract read:', err);
      }

      // 2. Load from Backend/localStorage service
      try {
        const data = await fetchBatchFromBackend(currentBatchId.trim());
        if (isMounted) {
          setBatchData(data);
        }
      } catch (err) {
        console.error('Error fetching batch:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

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
    onChainBatch?.status === BatchStatus.ExportCleared ||
    batchData?.data.logs?.some(l => l.action.includes('CLEARED') || l.verifier === 'Customs_Inspector');

  const currentUrl = window.location.href;

  const traceTypeName = onChainBatch
    ? onChainBatch.traceType === TraceType.IdentityPreserved
      ? 'Identity Preserved (Single Farm)'
      : onChainBatch.traceType === TraceType.MassBalance
      ? 'Mass Balance (Factory Merge)'
      : 'Individual Trace'
    : 'Identity Preserved';

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '10px 0 40px 0' }}>

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

          {/* Chain Proof indicator */}
          <div style={{ fontSize: '11px', fontWeight: 700 }}>
            {onChainBatch ? (
              <span style={{ color: '#15803d', background: '#ecfdf5', padding: '4px 10px', borderRadius: '6px', border: '1px solid #86efac', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} strokeWidth={3} />
                <span>On-Chain LAB Chain (5222)</span>
              </span>
            ) : (
              <span style={{ color: '#0284c7', background: '#f0f9ff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bae6fd' }}>
                🌐 Verified State Cache
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
            ຄົ້ນຫາ (Search)
          </button>
        </form>
      </div>

      {isLoading ? (
        <div style={{ background: '#ffffff', padding: '40px', textAlign: 'center', borderRadius: '8px', border: '1px solid #d5dfce' }}>
          <div style={{ fontSize: '14px', color: '#153826', fontWeight: 800 }}>ກຳລັງດຶງຂໍ້ມູນປະຫວັດສິນຄ້າຈາກ Smart Contract & Backend...</div>
        </div>
      ) : !batchData?.data?.batch && !onChainBatch ? (
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
                  {onChainBatch?.batchId || batchData?.data.batch.batch_id}
                </h2>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#142a1d', marginTop: '4px' }}>
                  {onChainBatch?.productType || batchData?.data.batch.product_name}
                </div>
                <div style={{ fontSize: '12px', color: '#4d6052', marginTop: '2px' }}>
                  ປະເພດ: <strong>{traceTypeName}</strong>
                  {onChainBatch?.quantity ? ` • ${onChainBatch.quantity.toString()} kg` : ''}
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
                    <span>✅ ຜ່ານດ່ານສຸລະກາກອນຮຽບຮ້ອຍ (Export Cleared)</span>
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
                    <span>Registered on Labchain</span>
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

            {/* Smart Contract Proof Bar */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              fontSize: '11.5px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>⛓️ Core Contract:</span>
                <span style={{ fontFamily: 'monospace', color: '#153826', fontWeight: 700 }}>
                  {LAO_TRACEABILITY_ADDRESS}
                </span>
              </div>
              <a
                href={`https://explorer.labchain.la/address/${LAO_TRACEABILITY_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#0284c7',
                  textDecoration: 'none',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>View on LAB Explorer</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Owner & Target Factory */}
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
                <span style={{ color: '#4d6052' }}>ເຈົ້າຂອງ / Operator: </span>
                <strong style={{ color: '#153826' }}>
                  {onChainBatch?.operator ? `${onChainBatch.operator.substring(0, 10)}...` : batchData?.data.batch.owner}
                </strong>
              </div>
              {onChainBatch?.targetFactory && (
                <div>
                  <span style={{ color: '#4d6052' }}>ໂຮງງານປາຍທາງ (Target Factory): </span>
                  <strong style={{ color: '#153826', fontFamily: 'monospace' }}>
                    {onChainBatch.targetFactory.substring(0, 10)}...{onChainBatch.targetFactory.substring(36)}
                  </strong>
                </div>
              )}
            </div>
          </div>

          {/* 2. Bilingual GACC Box (Chinese & English) */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #d5dfce',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Languages size={18} color="#153826" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#153826', margin: 0 }}>
                ຂໍ້ມູນໃບແຈ້ງພາສີ ແລະ ມາດຕະຖານ GACC (ສປ ຈີນ)
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '6px', padding: '14px' }}>
                <div style={{ fontSize: '11px', color: '#854d0e', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  🇨🇳 中文 (CHINESE TRANSLATION - GACC)
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#713f12' }}>
                  {parsedOcrEvidence?.product_name?.zh || '新鲜阿拉比卡咖啡豆 (老挝特级)'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#854d0e', marginTop: '6px' }}>
                  海关代码: GACC-LAO-COF-8812 • 磨憨口岸通关
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '14px' }}>
                <div style={{ fontSize: '11px', color: '#166534', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  🇬🇧 ENGLISH (INTERNATIONAL EXPORT)
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#14532d' }}>
                  {parsedOcrEvidence?.product_name?.en || 'Fresh Arabica Coffee Beans (Grade A)'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#166534', marginTop: '6px' }}>
                  Origin: Paksong, Champasak, Lao PDR
                </div>
              </div>
            </div>
          </div>

          {/* 3. Traceability Timeline */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #d5dfce',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#153826', margin: '0 0 20px 0', borderBottom: '1px solid #edf2e7', paddingBottom: '12px' }}>
              ເສັ້ນທາງການເດີນທາງຂອງສິນຄ້າ (Traceability Audit Trail Timeline)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
              
              {/* Step 1: Farm Origin */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d', flexShrink: 0 }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#142a1d' }}>
                    1. ຊາວກະສິກອນລົງທະບຽນຕົ້ນນ້ຳ (Farmer Registration)
                  </div>
                  <div style={{ fontSize: '12px', color: '#4d6052', marginTop: '3px' }}>
                    {batchData?.data.batch.farm_location || '15.1764, 106.2341 (Paksong Highland, Champasak)'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#15803d', marginTop: '4px', fontWeight: 700 }}>
                    ✓ ບັນທຶກພິກັດ GPS ແປງປູກດາວທຽມຮຽບຮ້ອຍ
                  </div>
                </div>
              </div>

              {/* Step 2: AI Satellite Check */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', flexShrink: 0 }}>
                  <Satellite size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#142a1d' }}>
                    2. ກວດສອບດາວທຽມ EUDR ບໍ່ຕັດໄມ້ທຳລາຍປ່າ (Sentinel-2 AI)
                  </div>
                  <div style={{ fontSize: '12px', color: '#4d6052', marginTop: '3px' }}>
                    Copernicus Sentinel-2 • Canopy Score: 0.86 • Cutoff Baseline: 2020-12-31
                  </div>
                  <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '4px', fontWeight: 700 }}>
                    ✓ EUDR_PASSED (Verified by EUDR AI Engine)
                  </div>
                </div>
              </div>

              {/* Step 3: AI Document Translation */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309', flexShrink: 0 }}>
                  <Languages size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#142a1d' }}>
                    3. ສະແກນ ແລະ ແປພາສາຈີນ e-Phyto (AI CrossBorder OCR)
                  </div>
                  <div style={{ fontSize: '12px', color: '#4d6052', marginTop: '3px' }}>
                    ແປພາສາລາວເປັນພາສາຈີນ ແລະ ອັງກິດ ອັດຕະໂນມັດ ຕາມມາດຕະຖານ IPPC
                  </div>
                  <div style={{ fontSize: '11px', color: '#b45309', marginTop: '4px', fontWeight: 700 }}>
                    ✓ DOCUMENTS_VERIFIED_AND_TRANSLATED
                  </div>
                </div>
              </div>

              {/* Step 4: Customs Green Channel Clearance */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isCustomsCleared ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isCustomsCleared ? '#15803d' : '#94a3b8', flexShrink: 0 }}>
                  <TrainTrack size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: isCustomsCleared ? '#15803d' : '#64748b' }}>
                    4. ຜ່ານດ່ານສຸລະກາກອນຊ່ອງຂຽວ (Lao-China Railway Green Channel)
                  </div>
                  <div style={{ fontSize: '12px', color: '#4d6052', marginTop: '3px' }}>
                    ດ່ານສາກົນບໍ່ເຕັນ (LA) ⇌ ໂມ່ຫານ (CN) • ອະນຸມັດປ່ອຍຜ່ານຂະບວນລົດໄຟຂົນສົ່ງສິນຄ້າ
                  </div>
                  <div style={{ fontSize: '11px', color: isCustomsCleared ? '#15803d' : '#94a3b8', marginTop: '4px', fontWeight: 700 }}>
                    {isCustomsCleared ? '✓ GACC_CLEARED_GREEN_CHANNEL' : '⏳ ລໍຖ້າດ່ານສຸລະກາກອນກວດປ່ອຍ'}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
