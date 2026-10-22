import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Satellite, FileText, CheckCircle2, Terminal, ArrowRight, RefreshCw, Languages, ShieldCheck, Activity } from 'lucide-react';
import { runAiVerify, runCustomsClearance, BACKEND_BASE_URL } from '../services/backendApi';

export function AiDashboard() {
  const [batchId, setBatchId] = useState<string>('BATCH-LAO-001');

  // AI Execution States
  const [isVerifyingEudr, setIsVerifyingEudr] = useState<boolean>(false);
  const [eudrSuccess, setEudrSuccess] = useState<boolean>(false);
  const [eudrDetails, setEudrDetails] = useState<any>(null);

  const [isVerifyingOcr, setIsVerifyingOcr] = useState<boolean>(false);
  const [ocrSuccess, setOcrSuccess] = useState<boolean>(false);
  const [ocrDetails, setOcrDetails] = useState<any>(null);

  // Terminal log stream
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] AI Daemon initialized on port 4001. Waiting for agent trigger...`
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // 1. Run AI EUDR Satellite Verification
  const handleRunEudr = async () => {
    setIsVerifyingEudr(true);
    setEudrSuccess(false);
    addLog(`>>> TRIGGER: Calling POST ${BACKEND_BASE_URL}/batch/ai-verify for batch "${batchId}"`);
    addLog(`Connecting to ESA Copernicus Sentinel-2 satellite pipeline...`);

    // Simulate 1.5s scanning effect for demo
    await new Promise(r => setTimeout(r, 1200));
    addLog(`Calculating historical NDVI index (Baseline: 2020-12-31)...`);

    const res = await runAiVerify(batchId.trim());
    setIsVerifyingEudr(false);

    if (res.success) {
      setEudrSuccess(true);
      setEudrDetails({
        ndviScore: 0.86,
        cutoffDate: '2020-12-31',
        provider: 'Sentinel-2 Multispectral Instrument (MSI)',
        hash: 'QmSentinel2VerifiedCanopyScore086NDVI'
      });
      addLog(`SUCCESS: Sentinel-2 NDVI Score: 0.86 (Passed EUDR 2020 cutoff date).`);
      addLog(`Status: EUDR_PASSED (Verified by EUDR AI Engine). On-chain hash committed.`);
    } else {
      addLog(`ERROR: AI Verify failed: ${res.error}`);
    }
  };

  // 2. Run AI OCR & VLM Document Translation
  const handleRunOcr = async () => {
    setIsVerifyingOcr(true);
    setOcrSuccess(false);
    addLog(`>>> TRIGGER: Calling POST ${BACKEND_BASE_URL}/batch/customs-clearance (Action: DOCUMENTS_VERIFIED_AND_TRANSLATED)`);
    addLog(`Scanning Phyto Phytosanitary Certificate image via Vision-Language Model...`);

    await new Promise(r => setTimeout(r, 1400));
    addLog(`Extracting GACC Orchard Code and translating Lao text into Simplified Chinese & English...`);

    const translationData = {
      product_name: {
        en: "Fresh Arabica Coffee Beans",
        zh: "新鲜阿拉比卡咖啡豆"
      }
    };

    const payload = {
      batch_id: batchId.trim(),
      action: "DOCUMENTS_VERIFIED_AND_TRANSLATED",
      evidence_hash: JSON.stringify(translationData)
    };

    const res = await runCustomsClearance(payload);
    setIsVerifyingOcr(false);

    if (res.success) {
      setOcrSuccess(true);
      setOcrDetails({
        zh: "新鲜阿拉比卡咖啡豆",
        en: "Fresh Arabica Coffee Beans",
        orchardCode: "GACC-LAO-COF-8812",
        sealNo: "SEAL-MO-9921"
      });
      addLog(`SUCCESS: AI OCR translation complete. Chinese: "新鲜阿拉比卡咖啡豆"`);
      addLog(`Status: DOCUMENTS_VERIFIED_AND_TRANSLATED committed to audit trail.`);
    } else {
      addLog(`ERROR: OCR Clearance failed: ${res.error}`);
    }
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '10px 0 40px 0' }}>

      {/* Top Banner */}
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
            <span style={{ fontSize: '20px' }}>🤖</span>
            <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#153826', margin: 0 }}>
              3. ໜ້າຈຳລອງການເຮັດວຽກ AI (AI Agents Dashboard)
            </h1>
          </div>
          <p style={{ fontSize: '12.5px', color: '#4d6052', margin: '4px 0 0 0' }}>
            Autonomous Sentinel-2 EUDR Verification & Multilingual Cross-Border OCR Agent
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
            <Activity size={14} color="#16a34a" />
            AI Pipeline Ready
          </span>
          <Link
            to="/customs"
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
            <span>ໄປໜ້າດ່ານສຸລະກາກອນ</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Batch Selector Bar */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #d5dfce',
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
          <label style={{ fontSize: '13px', fontWeight: 800, color: '#153826', whiteSpace: 'nowrap' }}>
            ເລືອກລະຫັດລັອດທີ່ຕ້ອງການທົດສອບ AI (batch_id):
          </label>
          <input
            type="text"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1.5px solid #d5dfce',
              fontSize: '13px',
              fontWeight: 800,
              color: '#153826',
              minWidth: '180px'
            }}
          />
        </div>

        {/* Quick chip presets */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setBatchId('BATCH-LAO-001')}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: batchId === 'BATCH-LAO-001' ? '1.5px solid #153826' : '1px solid #d5dfce',
              background: batchId === 'BATCH-LAO-001' ? '#eaf1e5' : '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            BATCH-LAO-001 (ຟາມຕົ້ນນ້ຳ)
          </button>
          <button
            type="button"
            onClick={() => setBatchId('FACTORY-001')}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: batchId === 'FACTORY-001' ? '1.5px solid #153826' : '1px solid #d5dfce',
              background: batchId === 'FACTORY-001' ? '#eaf1e5' : '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            FACTORY-001 (ໂຮງງານ)
          </button>
        </div>
      </div>

      {/* 2 AI Agent Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px', marginBottom: '24px' }}>

        {/* 1. AI EUDR Satellite Card */}
        <div style={{
          background: '#ffffff',
          border: '2px solid #15803d',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(21, 128, 61, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Satellite size={20} color="#15803d" />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#142a1d', margin: 0 }}>
                    ປຸ່ມທີ 1: AI ກວດດາວທຽມ (EUDR)
                  </h3>
                  <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700 }}>
                    POST /batch/ai-verify
                  </span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '12.5px', color: '#4d6052', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              ດາວທຽມ Sentinel-2 ຈະວິເຄາະພາບຖ່າຍແປງປູກຍ້ອນຫຼັງ ຢັ້ງຢືນວ່າບໍ່ໄດ້ຕັດໄມ້ທຳລາຍປ່າຫຼັງວັນທີ 31/12/2020 ເພື່ອສົ່ງອອກໄປສະຫະພາບເອີຣົບ.
            </p>

            {eudrSuccess && eudrDetails && (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px', padding: '12px', marginBottom: '16px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', fontWeight: 800, marginBottom: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>✅ ປອດການຕັດໄມ້ທຳລາຍປ່າ (EUDR Compliant)</span>
                </div>
                <div style={{ color: '#166534', lineHeight: 1.5 }}>
                  • ຄ່າດັດຊະນີພືດພັນ (NDVI Score): <strong>{eudrDetails.ndviScore}</strong><br />
                  • ວັນຕັດເກນ: <strong>{eudrDetails.cutoffDate}</strong><br />
                  • ດາວທຽມ: {eudrDetails.provider}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleRunEudr}
            disabled={isVerifyingEudr}
            style={{
              padding: '12px 18px',
              background: '#15803d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: isVerifyingEudr ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(21, 128, 61, 0.25)'
            }}
          >
            {isVerifyingEudr ? (
              <span>ກຳລັງດຶງພາບ Sentinel-2...</span>
            ) : (
              <>
                <Satellite size={17} />
                <span>🛰️ ຮັນ AI ກວດດາວທຽມ (EUDR)</span>
              </>
            )}
          </button>
        </div>

        {/* 2. AI OCR Document Translation Card */}
        <div style={{
          background: '#ffffff',
          border: '2px solid #b45309',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(180, 83, 9, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Languages size={20} color="#b45309" />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#142a1d', margin: 0 }}>
                    ປຸ່ມທີ 2: AI ສະແກນເອກະສານ (OCR/VLM)
                  </h3>
                  <span style={{ fontSize: '11px', color: '#b45309', fontWeight: 700 }}>
                    POST /batch/customs-clearance
                  </span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '12.5px', color: '#4d6052', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              ສະແກນໃບສຸຂານາໄມພືດ (e-Phyto) ແລະ ແປພາສາລາວເປັນ ພາສາຈີນ (GACC) ແລະ ພາສາອັງກິດອັດຕະໂນມັດ ສຳລັບສົ່ງອອກທາງລົດໄຟ ລາວ-ຈີນ.
            </p>

            {ocrSuccess && ocrDetails && (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '12px', marginBottom: '16px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: 800, marginBottom: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>🇨🇳 ແປພາສາຈີນ GACC ສຳເລັດ</span>
                </div>
                <div style={{ color: '#78350f', lineHeight: 1.5 }}>
                  • ຊື່ຈີນ: <strong style={{ fontSize: '14px', color: '#92400e' }}>{ocrDetails.zh}</strong><br />
                  • ຊື່ອັງກິດ: <strong>{ocrDetails.en}</strong><br />
                  • GACC Orchard Code: {ocrDetails.orchardCode}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleRunOcr}
            disabled={isVerifyingOcr}
            style={{
              padding: '12px 18px',
              background: '#b45309',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: isVerifyingOcr ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(180, 83, 9, 0.25)'
            }}
          >
            {isVerifyingOcr ? (
              <span>ກຳລັງສະແກນ OCR & ແປພາສາ...</span>
            ) : (
              <>
                <FileText size={17} />
                <span>📑 ຮັນ AI ສະແກນເອກະສານ (OCR/VLM)</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Terminal Output Log Container */}
      <div style={{
        background: '#0f172a',
        borderRadius: '8px',
        padding: '16px 20px',
        color: '#38bdf8',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        border: '1px solid #1e293b'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={16} color="#38bdf8" />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.5px' }}>
              AI AGENT EXECUTION CONSOLE (PORT 4001)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setLogs([`[${new Date().toLocaleTimeString()}] Console cleared.`])}
            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '11px', cursor: 'pointer' }}
          >
            Clear logs
          </button>
        </div>

        <div style={{ fontFamily: 'inherit', fontSize: '11.5px', lineHeight: 1.6, maxHeight: '160px', overflowY: 'auto' }}>
          {logs.map((line, idx) => (
            <div key={idx} style={{ color: line.includes('SUCCESS') ? '#4ade80' : line.includes('TRIGGER') ? '#facc15' : '#cbd5e1' }}>
              {line}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
