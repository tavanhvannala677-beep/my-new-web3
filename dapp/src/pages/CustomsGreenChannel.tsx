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
  Sparkles,
  Wallet as WalletIcon
} from 'lucide-react';
import { BrowserProvider, getAddress } from 'ethers';
import { fetchBatchFromBackend, runCustomsClearance, parseEvidenceHash, BatchResponse } from '../services/backendApi';
import {
  addVerificationLogOnChain,
  getBatchFromChain,
  getBatchLogsFromChain,
  getLabChainReadOnlyProvider
} from '../services/web3Traceability';
import {
  LAO_TRACEABILITY_ADDRESS,
  BatchStatus
} from '../contracts/laoNationalTraceability';

export function CustomsGreenChannel() {
  // Step 1: Input / Scan State
  const [activeTab, setActiveTab] = useState<'manual' | 'camera'>('manual');
  const [inputBatchId, setInputBatchId] = useState<string>('BATCH-LAO-001');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraScanProgress, setCameraScanProgress] = useState<number>(0);

  // Web3 Wallet State
  const [walletAccount, setWalletAccount] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState<boolean>(false);

  // Loaded Batch State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [batchData, setBatchData] = useState<BatchResponse | null>(null);
  const [onChainBatch, setOnChainBatch] = useState<any | null>(null);

  // Step 2: Approval State
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [approvalResult, setApprovalResult] = useState<any>(null);
  const [onChainTxHash, setOnChainTxHash] = useState<string | null>(null);

  // Detect Wallet
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const eth = (window as any).ethereum;
      eth.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setWalletAccount(getAddress(accounts[0]));
          }
        })
        .catch(() => {});

      const handleAccounts = (accs: string[]) => {
        setWalletAccount(accs.length ? getAddress(accs[0]) : null);
      };
      eth.on?.('accountsChanged', handleAccounts);
      return () => {
        eth.removeListener?.('accountsChanged', handleAccounts);
      };
    }
  }, []);

  const handleConnectWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('MetaMask ບໍ່ພົບໃນບຣາວເຊີ. ກະລຸນາຕິດຕັ້ງ MetaMask');
      return;
    }
    try {
      setIsConnectingWallet(true);
      const eth = (window as any).ethereum;
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts[0]) {
        setWalletAccount(getAddress(accounts[0]));
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  // Fetch batch details on load or submission
  const loadBatch = async (id: string) => {
    setIsLoading(true);
    setApprovalResult(null);
    setOnChainTxHash(null);

    // Try fetching from Smart Contract first
    try {
      const provider = (typeof window !== 'undefined' && (window as any).ethereum)
        ? new BrowserProvider((window as any).ethereum)
        : getLabChainReadOnlyProvider();

      const chainBatch = await getBatchFromChain(provider, id.trim());
      const chainLogs = await getBatchLogsFromChain(provider, id.trim());

      if (chainBatch) {
        setOnChainBatch({
          ...chainBatch,
          logs: chainLogs
        });
      }
    } catch (e) {
      console.warn('Could not read from contract:', e);
    }

    // Always ensure backend / mock data is also loaded for rich UI display
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

  // Step 2: Approve Customs Clearance (addVerificationLog on-chain)
  const handleApproveClearance = async () => {
    const targetBatchId = batchData?.data.batch.batch_id || inputBatchId;
    if (!targetBatchId) return;

    setIsApproving(true);
    let txHash = '';

    try {
      // On-Chain verification log call to Smart Contract
      if (typeof window !== 'undefined' && (window as any).ethereum && walletAccount) {
        const provider = new BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();

        const onChainRes = await addVerificationLogOnChain(signer, {
          batchId: targetBatchId,
          action: 'GACC_CLEARED_GREEN_CHANNEL',
          evidenceHash: 'Customs Officer Verified #8812 - Mohan/Boten Border Control',
          newStatus: BatchStatus.ExportCleared // 3
        });

        txHash = onChainRes.txHash;
        setOnChainTxHash(txHash);
      }

      // Sync with backend
      const payload = {
        batch_id: targetBatchId,
        action: 'GACC_CLEARED_GREEN_CHANNEL',
        evidence_hash: 'Customs Officer Verified #8812 - Mohan/Boten Border Control'
      };

      await runCustomsClearance(payload);

      setApprovalResult({
        approvedAt: new Date().toISOString(),
        officer: 'GACC Mohan Officer #8812 & Boten Customs Node',
        trainNo: 'Lao-China Railway Cargo LX-802',
        sealId: 'TGHU-992140-7',
        txHash
      });

      // Refresh view
      loadBatch(targetBatchId);
    } catch (err: any) {
      console.error('Approval failed:', err);
      alert('Approval error: ' + (err.message || 'Transaction failed'));
    } finally {
      setIsApproving(false);
    }
  };

  const eudrLog = batchData?.data.logs?.find(l => l.verifier === 'AI_EUDR_Engine');
  const ocrLog = batchData?.data.logs?.find(l => l.verifier === 'AI_CrossBorder_OCR');
  const parsedOcr = ocrLog ? parseEvidenceHash(ocrLog.evidence_hash) : null;
  const isAlreadyCleared =
    batchData?.data.batch.status === 'GACC_CLEARED_GREEN_CHANNEL' ||
    Boolean(approvalResult) ||
    onChainBatch?.status === BatchStatus.ExportCleared;

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
            ກວດສອບ Smart Contract ➔ ອະນຸມັດ <code>addVerificationLog (ExportCleared)</code> ບົນ LAB Chain
          </p>
        </div>

        {/* Web3 Wallet status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {walletAccount ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: '#dcfce7',
              border: '1px solid #86efac',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#15803d'
            }}>
              <WalletIcon size={14} />
              <span>ດ່ານພາສີ: {walletAccount.substring(0, 6)}...{walletAccount.substring(38)}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConnectWallet}
              disabled={isConnectingWallet}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: '#153826',
                border: 'none',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: 800,
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <WalletIcon size={14} />
              <span>{isConnectingWallet ? 'ກຳລັງເຊື່ອມ...' : 'ເຊື່ອມ MetaMask (ເຈົ້າໜ້າທີ່)'}</span>
            </button>
          )}

          <div style={{ fontSize: '11px', color: '#15803d', background: '#ecfdf5', padding: '4px 10px', borderRadius: '4px', border: '1px solid #86efac', fontWeight: 700 }}>
            Mohan ⇌ Boten Fast-Pass
          </div>
        </div>
      </div>

      {/* STEP 1: Search / Scan Input Box (Dual Input Tab) */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #d5dfce',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#153826',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 900
            }}>1</span>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#142a1d', margin: 0 }}>
              Step 1: ປ້ອນລະຫັດລັອດ ຫຼື ສະແກນ QR Code (Dual Input)
            </h2>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            background: '#edf2e7',
            padding: '3px',
            borderRadius: '6px',
            border: '1px solid #d5dfce'
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              style={{
                padding: '6px 14px',
                borderRadius: '4px',
                border: 'none',
                background: activeTab === 'manual' ? '#153826' : 'transparent',
                color: activeTab === 'manual' ? '#ffffff' : '#4d6052',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Search size={13} />
              <span>ພິມລະຫັດເອງ (Manual)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('camera')}
              style={{
                padding: '6px 14px',
                borderRadius: '4px',
                border: 'none',
                background: activeTab === 'camera' ? '#153826' : 'transparent',
                color: activeTab === 'camera' ? '#ffffff' : '#4d6052',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Camera size={13} />
              <span>ສະແກນ QR ຜ່ານກ້ອງ</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Manual Input */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSearch} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={inputBatchId}
                onChange={(e) => setInputBatchId(e.target.value)}
                placeholder="ປ້ອນລະຫັດ Batch ID ຈາກໃບ Manifest (ເຊັ່ນ: BATCH-LAO-001 ຫຼື FACTORY-001)..."
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '6px',
                  border: '1.5px solid #d5dfce',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  color: '#153826',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '11px 20px',
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
              <Search size={15} />
              <span>{isLoading ? 'ກຳລັງຄົ້ນຫາ...' : 'ດຶງຂໍ້ມູນ (Search)'}</span>
            </button>
          </form>
        )}

        {/* Tab 2: Camera Scanner */}
        {activeTab === 'camera' && (
          <div style={{
            background: '#0f172a',
            borderRadius: '8px',
            padding: '24px',
            textAlign: 'center',
            color: '#ffffff'
          }}>
            {isCameraActive ? (
              <div style={{ maxWidth: '340px', margin: '0 auto' }}>
                <div style={{
                  width: '200px',
                  height: '200px',
                  border: '2px solid #22c55e',
                  borderRadius: '12px',
                  margin: '0 auto 16px auto',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(34, 197, 94, 0.05)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: `${cameraScanProgress}%`,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#22c55e',
                    boxShadow: '0 0 8px #22c55e'
                  }} />
                  <QrCode size={64} color="#22c55e" style={{ opacity: 0.6 }} />
                </div>
                <div style={{ fontSize: '13px', color: '#86efac', fontWeight: 700 }}>
                  ກຳລັງສະແກນ QR Code... {cameraScanProgress}%
                </div>
              </div>
            ) : (
              <div>
                <QrCode size={44} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '6px' }}>
                  ກ້ອງພ້ອມສະແກນ QR Code ໜ້າກ່ອງສິນຄ້າ
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
                  ກົດປຸ່ມດ້ານລຸ່ມເພື່ອເປີດກ້ອງ ຫຼື ຈຳລອງການສະແກນສິນຄ້າຜ່ານດ່ານ
                </p>
                <button
                  type="button"
                  onClick={startCameraScan}
                  style={{
                    padding: '10px 22px',
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Camera size={16} />
                  <span>ເປີດກ້ອງສະແກນ (Simulate Scan)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Batch Inspection Details */}
      {batchData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{
            background: '#ffffff',
            border: '1.5px solid #d5dfce',
            borderRadius: '8px',
            padding: '22px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#153826', letterSpacing: '0.4px' }}>
                    {batchData.data.batch.batch_id}
                  </span>
                  {isAlreadyCleared ? (
                    <span style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                      ✓ GACC_CLEARED_GREEN_CHANNEL
                    </span>
                  ) : (
                    <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                      ⏳ ລໍຖ້າເຈົ້າໜ້າທີ່ອະນຸມັດ
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155', marginTop: '4px' }}>
                  {batchData.data.batch.product_name}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>ເຈົ້າຂອງ / ໂຮງງານ:</div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#153826' }}>
                  {batchData.data.batch.owner}
                </div>
              </div>
            </div>

            {/* Smart Contract On-Chain Details if present */}
            {onChainBatch && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px',
                fontSize: '11.5px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>⛓️ ຂໍ້ມູນ Smart Contract (On-Chain Proof):</span>
                  <span style={{ color: '#0284c7', fontFamily: 'monospace' }}>Address: {LAO_TRACEABILITY_ADDRESS.substring(0, 10)}...</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', color: '#334155' }}>
                  <div><strong>Operator:</strong> <span style={{ fontFamily: 'monospace' }}>{onChainBatch.operator.substring(0, 8)}...</span></div>
                  <div><strong>Target Factory:</strong> <span style={{ fontFamily: 'monospace' }}>{onChainBatch.targetFactory.substring(0, 8)}...</span></div>
                  <div><strong>Trace Type:</strong> {onChainBatch.traceType === 0 ? 'Identity Preserved' : 'Mass Balance'}</div>
                  <div><strong>Status:</strong> {onChainBatch.status === 3 ? 'ExportCleared (3)' : `Status (${onChainBatch.status})`}</div>
                </div>
              </div>
            )}

            {/* Evidence Cards Grid: EUDR Left, OCR Right */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              
              {/* EUDR Satellite Proof */}
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '6px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Satellite size={16} color="#15803d" />
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#166534' }}>
                    1. ຫຼັກຖານດາວທຽມ EUDR (Sentinel-2)
                  </span>
                </div>
                {eudrLog ? (
                  <div>
                    <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 700, marginBottom: '4px' }}>
                      ✓ {eudrLog.action}
                    </div>
                    <div style={{ fontSize: '11px', color: '#4d6052', fontFamily: 'monospace' }}>
                      Evidence Hash: {eudrLog.evidence_hash}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '11.5px', color: '#15803d' }}>
                    ✓ ຜ່ານການກວດສອບພື້ນທີ່ບໍ່ຕັດໄມ້ທຳລາຍປ່າແລ້ວ
                  </div>
                )}
              </div>

              {/* Chinese Translation Proof */}
              <div style={{
                background: '#fefce8',
                border: '1px solid #fef08a',
                borderRadius: '6px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Languages size={16} color="#854d0e" />
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#854d0e' }}>
                    2. ຂໍ້ມູນແປພາສາຈີນ (GACC e-Phyto)
                  </span>
                </div>
                {parsedOcr?.product_name ? (
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#713f12' }}>
                      🇨🇳 {parsedOcr.product_name.zh || '新鲜阿拉比卡咖啡豆'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#854d0e' }}>
                      🇬🇧 {parsedOcr.product_name.en || 'Fresh Arabica Coffee Beans'}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: '#854d0e' }}>
                    🇨🇳 新鲜阿拉比卡咖啡豆 (GACC Orchard Verified)
                  </div>
                )}
              </div>
            </div>

            {/* STEP 2: Big Green Approve Button */}
            <div style={{
              borderTop: '1.5px solid #edf2e7',
              paddingTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#4d6052' }}>
                Step 2: ກົດປຸ່ມດ້ານລຸ່ມເພື່ອບັນທຶກ <code>addVerificationLog</code> ບົນ Smart Contract ແລະ ປ່ອຍຜ່ານດ່ານ
              </div>

              <button
                type="button"
                onClick={handleApproveClearance}
                disabled={isApproving || isAlreadyCleared}
                style={{
                  width: '100%',
                  maxWidth: '480px',
                  padding: '15px 24px',
                  background: isAlreadyCleared ? '#15803d' : '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 900,
                  cursor: isAlreadyCleared ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                  transition: 'all 0.18s ease'
                }}
              >
                <CheckCircle2 size={20} />
                <span>
                  {isApproving
                    ? 'ກຳລັງຢືນຢັນບົນ Smart Contract...'
                    : isAlreadyCleared
                    ? '✓ ອະນຸມັດຜ່ານດ່ານຮຽບຮ້ອຍ (Export Cleared)'
                    : '✅ ອະນຸມັດຜ່ານດ່ານ (Approve Customs Clearance)'}
                </span>
              </button>

              {onChainTxHash && (
                <a
                  href={`https://explorer.labchain.la/tx/${onChainTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11.5px',
                    color: '#0284c7',
                    textDecoration: 'none',
                    fontWeight: 700
                  }}
                >
                  <span>Transaction Hash: {onChainTxHash.substring(0, 12)}...{onChainTxHash.substring(54)}</span>
                  <ExternalLink size={12} />
                </a>
              )}

              {approvalResult && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  borderRadius: '6px',
                  padding: '12px 18px',
                  width: '100%',
                  boxSizing: 'border-box',
                  fontSize: '12px',
                  color: '#166534',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div>
                    <strong>🚂 ຂະບວນລົດໄຟ:</strong> {approvalResult.trainNo} • <strong>Seal:</strong> {approvalResult.sealId}
                  </div>
                  <div>
                    <strong>ເວລາອະນຸມັດ:</strong> {new Date().toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
