import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Factory,
  Plus,
  Trash2,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Printer,
  Share2,
  RefreshCw,
  Layers,
  Wallet as WalletIcon,
  ExternalLink,
  CheckSquare,
  Square
} from 'lucide-react';
import { BrowserProvider, getAddress } from 'ethers';
import { mergeBatchesToBackend, MergeBatchPayload } from '../services/backendApi';
import {
  splitOrMergeBatchOnChain,
  queryFactoryIncomingBatches
} from '../services/web3Traceability';
import {
  LAO_TRACEABILITY_ADDRESS,
  getLaoTraceabilityContract
} from '../contracts/laoNationalTraceability';

export function FactoryMerge() {
  // Web3 Wallet State
  const [walletAccount, setWalletAccount] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState<boolean>(false);

  // Incoming batches from farmers targeting this factory
  const [incomingBatches, setIncomingBatches] = useState<{ batchId: string; operator: string; traceType: number }[]>([
    { batchId: 'BATCH-LAO-001', operator: '0x15...Paksong', traceType: 0 },
    { batchId: 'BATCH-LAO-002', operator: '0x88...Bolaven', traceType: 0 },
    { batchId: 'BATCH-LAO-003', operator: '0x32...LuangPrabang', traceType: 0 }
  ]);
  const [isLoadingIncoming, setIsLoadingIncoming] = useState<boolean>(false);

  // Form State
  const [newBatchId, setNewBatchId] = useState<string>('FACTORY-001');
  const [productName, setProductName] = useState<string>('Roasted Coffee Blend (Export Grade)');
  const [quantity, setQuantity] = useState<number>(5000.5);
  const [owner, setOwner] = useState<string>('ໂຮງງານແປຮູບກາເຟດາວ (Dao Coffee Factory)');
  const [targetDestination, setTargetDestination] = useState<string>('0x2546BcD3c84621e976D8185a91A922aE77ECEc30'); // Customs/Port Wallet
  const [parentBatches, setParentBatches] = useState<string[]>(['BATCH-LAO-001', 'BATCH-LAO-002']);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [onChainTxHash, setOnChainTxHash] = useState<string | null>(null);
  const [mergedResult, setMergedResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Detect Wallet
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const eth = (window as any).ethereum;
      eth.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            const acc = getAddress(accounts[0]);
            setWalletAccount(acc);
            fetchIncomingBatches(acc);
          }
        })
        .catch(() => {});

      const handleAccounts = (accs: string[]) => {
        if (accs.length) {
          const acc = getAddress(accs[0]);
          setWalletAccount(acc);
          fetchIncomingBatches(acc);
        } else {
          setWalletAccount(null);
        }
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
        const acc = getAddress(accounts[0]);
        setWalletAccount(acc);
        fetchIncomingBatches(acc);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  // Fetch registered batches destined for this factory from on-chain events
  const fetchIncomingBatches = async (factoryAddr: string) => {
    if (typeof window === 'undefined' || !(window as any).ethereum) return;
    try {
      setIsLoadingIncoming(true);
      const provider = new BrowserProvider((window as any).ethereum);
      const events = await queryFactoryIncomingBatches(provider, factoryAddr);
      if (events && events.length > 0) {
        setIncomingBatches(events);
      }
    } catch (e) {
      console.warn('Could not query on-chain factory events, using defaults:', e);
    } finally {
      setIsLoadingIncoming(false);
    }
  };

  // Toggle parent batch selection
  const handleToggleParentBatch = (bId: string) => {
    setParentBatches(prev => {
      if (prev.includes(bId)) {
        return prev.filter(b => b !== bId);
      } else {
        return [...prev, bId];
      }
    });
  };

  // Dynamic Batch Input Handlers
  const handleAddParentBatch = () => {
    setParentBatches(prev => [...prev, `BATCH-LAO-00${prev.length + 1}`]);
  };

  const handleRemoveParentBatch = (index: number) => {
    if (parentBatches.length <= 1) return;
    setParentBatches(prev => prev.filter((_, i) => i !== index));
  };

  const handleParentBatchChange = (index: number, val: string) => {
    setParentBatches(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setOnChainTxHash(null);

    const validParents = parentBatches.filter(b => b.trim() !== '');
    if (validParents.length === 0) {
      setErrorMessage('ຕ້ອງເລືອກຢ່າງໜ້ອຍ 1 ລັອດຕົ້ນທາງ');
      setIsSubmitting(false);
      return;
    }

    try {
      let txHash = '';
      const manifestHash = `QmMassBalanceMerge_${newBatchId}_${Date.now()}`;

      // Call Smart Contract (splitOrMergeBatch) if MetaMask connected
      if (typeof window !== 'undefined' && (window as any).ethereum && walletAccount) {
        const provider = new BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();

        const onChainResult = await splitOrMergeBatchOnChain(signer, {
          newBatchId: newBatchId.trim(),
          parentBatches: validParents,
          productType: productName.trim(),
          newQuantity: Math.round(quantity),
          newOffChainDataHash: manifestHash,
          targetFactory: targetDestination.trim()
        });

        txHash = onChainResult.txHash;
        setOnChainTxHash(txHash);
      }

      // Sync with Backend API & localStorage
      const payload: MergeBatchPayload = {
        new_batch_id: newBatchId.trim(),
        product_name: productName.trim(),
        parent_batches: validParents,
        quantity: Number(quantity),
        owner: walletAccount || owner.trim()
      };

      await mergeBatchesToBackend(payload);

      setMergedResult({
        ...payload,
        txHash
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການລວມລັອດສິນຄ້າ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // QR Code tracking URL
  const trackingUrl = mergedResult
    ? `${window.location.origin}/#/track/${encodeURIComponent(mergedResult.new_batch_id)}`
    : '';

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '10px 0 40px 0' }}>

      {/* Top Banner & Context Header */}
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
            <span style={{ fontSize: '20px' }}>🏭</span>
            <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#153826', margin: 0 }}>
              2. ໜ້າໂຮງງານ (Factory Portal) — ລວມລັອດສິນຄ້າ (Mass Balance Merge)
            </h1>
          </div>
          <p style={{ fontSize: '12.5px', color: '#4d6052', margin: '4px 0 0 0' }}>
            ດຶງລັອດທີ່ລະບຸ <code>targetFactory</code> ຈາກ Smart Contract ➔ ເອີ້ນ <code>splitOrMergeBatch</code> ບົນ LAB Chain
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
              <span>{walletAccount.substring(0, 6)}...{walletAccount.substring(38)}</span>
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
              <span>{isConnectingWallet ? 'ກຳລັງເຊື່ອມ...' : 'ເຊື່ອມ MetaMask (ໂຮງງານ)'}</span>
            </button>
          )}

          <Link
            to="/ai-dashboard"
            style={{
              color: '#153826',
              textDecoration: 'none',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              background: '#eaf1e5',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          >
            <span>ໄປໜ້າ AI ➔</span>
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(300px, 0.8fr)', gap: '22px' }}>
        
        {/* Left Column: Form & Parent Batches Selection */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #d5dfce',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#142a1d', margin: '0 0 16px 0', borderBottom: '1px solid #edf2e7', paddingBottom: '10px' }}>
            ຟອມລວມລັອດສິນຄ້າໃໝ່ (Mass Balance Consolidation)
          </h2>

          {/* Section 1: Incoming Parent Batches from Contract Events */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '14px',
            marginBottom: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b' }}>
                📦 ລັອດທີ່ຊາວກະສິກອນສົ່ງມາຫາໂຮງງານນີ້ (Target Factory Filter):
              </span>
              <button
                type="button"
                onClick={() => walletAccount && fetchIncomingBatches(walletAccount)}
                style={{ fontSize: '11px', background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: 700 }}
              >
                {isLoadingIncoming ? 'ກຳລັງໂຫຼດ...' : '🔄 ຣີເຟຣຊ'}
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {incomingBatches.map(b => {
                const isSelected = parentBatches.includes(b.batchId);
                return (
                  <button
                    key={b.batchId}
                    type="button"
                    onClick={() => handleToggleParentBatch(b.batchId)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      border: isSelected ? '1.5px solid #153826' : '1px solid #cbd5e1',
                      background: isSelected ? '#dcfce7' : '#ffffff',
                      color: isSelected ? '#15803d' : '#334155',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isSelected ? <CheckSquare size={13} /> : <Square size={13} />}
                    <span>{b.batchId}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* New Batch ID & Product Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#153826', marginBottom: '6px' }}>
                  ລະຫັດລັອດໃໝ່ (_newBatchId): <span style={{ color: '#b45309' }}>*</span>
                </label>
                <input
                  type="text"
                  value={newBatchId}
                  onChange={(e) => setNewBatchId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #d5dfce',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#153826',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#153826', marginBottom: '6px' }}>
                  ຊື່ສິນຄ້າແປຮູບ (_productType): <span style={{ color: '#b45309' }}>*</span>
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #d5dfce',
                    fontSize: '13px',
                    color: '#142a1d',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Quantity & Destination Address */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#153826', marginBottom: '6px' }}>
                  ນ້ຳໜັກລວມ (_newQuantity kg): <span style={{ color: '#b45309' }}>*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #d5dfce',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#153826',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#153826', marginBottom: '6px' }}>
                  ປາຍທາງຕໍ່ໄປ (_targetFactory/Customs): <span style={{ color: '#b45309' }}>*</span>
                </label>
                <input
                  type="text"
                  value={targetDestination}
                  onChange={(e) => setTargetDestination(e.target.value)}
                  required
                  placeholder="0x..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #d5dfce',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#153826',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Dynamic Parent Batches List */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#153826' }}>
                  ລາຍການລັອດຍ່ອຍຕົ້ນທາງ (_parentBatches): <span style={{ color: '#b45309' }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddParentBatch}
                  style={{
                    background: '#eaf1e5',
                    border: '1px solid #c8d8c2',
                    color: '#153826',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={12} />
                  <span>ເພີ່ມລັອດຍ່ອຍ (+)</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {parentBatches.map((batch, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '11px',
                      color: '#4d6052',
                      width: '20px',
                      textAlign: 'center',
                      fontWeight: 700
                    }}>
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={batch}
                      onChange={(e) => handleParentBatchChange(index, e.target.value)}
                      placeholder={`ຕົວຢ່າງ: BATCH-LAO-00${index + 1}`}
                      required
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1.5px solid #d5dfce',
                        fontSize: '12.5px',
                        color: '#142a1d',
                        fontFamily: 'monospace',
                        fontWeight: 700
                      }}
                    />
                    {parentBatches.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveParentBatch(index)}
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          borderRadius: '6px',
                          padding: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px', borderRadius: '6px', color: '#991b1b', fontSize: '12px' }}>
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: '10px',
                padding: '12px 20px',
                background: '#153826',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(21, 56, 38, 0.2)'
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>ກຳລັງບັນທຶກ Smart Contract splitOrMergeBatch...</span>
                </>
              ) : (
                <>
                  <QrCode size={18} />
                  <span>ຢືນຢັນລວມລັອດ & ສ້າງ QR Code ສົ່ງອອກ</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: QR Code Result */}
        <div>
          {mergedResult ? (
            <div style={{
              background: '#ffffff',
              border: '2px solid #153826',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(21, 56, 38, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#dcfce7',
                color: '#15803d',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 800,
                marginBottom: '10px'
              }}>
                <CheckCircle2 size={14} />
                <span>ລວມລັອດສຳເລັດ (On-Chain Merged)</span>
              </div>

              <div style={{ fontSize: '20px', fontWeight: 900, color: '#153826' }}>
                {mergedResult.new_batch_id}
              </div>
              <div style={{ fontSize: '13px', color: '#4d6052', marginBottom: '8px' }}>
                {mergedResult.product_name} • {mergedResult.quantity.toLocaleString()} kg
              </div>

              {onChainTxHash && (
                <a
                  href={`https://explorer.labchain.la/tx/${onChainTxHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: '#0284c7',
                    textDecoration: 'none',
                    fontWeight: 700,
                    marginBottom: '10px'
                  }}
                >
                  <span>Tx: {onChainTxHash.substring(0, 10)}...{onChainTxHash.substring(56)}</span>
                  <ExternalLink size={11} />
                </a>
              )}

              {/* QR Code Container */}
              <div style={{
                background: '#ffffff',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #153826',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                marginBottom: '14px'
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(trackingUrl)}`}
                  alt="Factory Merged Batch QR"
                  style={{ width: '180px', height: '180px', display: 'block' }}
                />
              </div>

              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '14px', maxWidth: '280px' }}>
                QR Code ນີ້ເກັບຄ່າ URL: <code style={{ fontSize: '10px' }}>/track/{mergedResult.new_batch_id}</code> ນຳໄປພິມແປະກ່ອງສິນຄ້າສົ່ງອອກໄດ້ທັນທີ
              </div>

              {/* Print & Share Buttons */}
              <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    flex: 1,
                    padding: '9px',
                    background: '#edf2e7',
                    color: '#153826',
                    border: '1px solid #d5dfce',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Printer size={13} />
                  <span>ພິມ QR ຕິດກ່ອງ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(trackingUrl);
                    alert('ຄັດລອກລິ້ງຕິດຕາມແລ້ວ!');
                  }}
                  style={{
                    flex: 1,
                    padding: '9px',
                    background: '#edf2e7',
                    color: '#153826',
                    border: '1px solid #d5dfce',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Share2 size={13} />
                  <span>ຄັດລອກລິ້ງ</span>
                </button>
              </div>

              <Link
                to={`/track/${encodeURIComponent(mergedResult.new_batch_id)}`}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '11px 16px',
                  background: '#153826',
                  color: '#ffffff',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>ເປີດກວດສອບລັອດນີ້ (Track Timeline)</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div style={{
              background: '#f8fafc',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '8px',
              padding: '40px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <QrCode size={48} strokeWidth={1.5} color="#94a3b8" />
              <div style={{ marginTop: '12px', fontWeight: 800, fontSize: '14px', color: '#334155' }}>
                QR Code ຈະຖືກສ້າງຂຶ້ນອັດຕະໂນມັດ
              </div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                ຫຼັງຈາກກົດຢືນຢັນລວມລັອດ ແລະ ບັນທຶກສັນຍາ Smart Contract ສຳເລັດ
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
