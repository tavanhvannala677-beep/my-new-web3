import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Factory, Plus, Trash2, QrCode, CheckCircle2, ArrowRight, Printer, Share2, RefreshCw, Layers } from 'lucide-react';
import { mergeBatchesToBackend, MergeBatchPayload, BACKEND_BASE_URL } from '../services/backendApi';

export function FactoryMerge() {
  // Form State
  const [newBatchId, setNewBatchId] = useState<string>('FACTORY-001');
  const [productName, setProductName] = useState<string>('Roasted Coffee Blend (Export Grade)');
  const [quantity, setQuantity] = useState<number>(5000.5);
  const [owner, setOwner] = useState<string>('ໂຮງງານແປຮູບກາເຟດາວ (Dao Coffee Factory)');
  const [parentBatches, setParentBatches] = useState<string[]>(['BATCH-LAO-001', 'BATCH-LAO-002']);

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

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mergedResult, setMergedResult] = useState<MergeBatchPayload | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: MergeBatchPayload = {
      new_batch_id: newBatchId.trim(),
      product_name: productName.trim(),
      parent_batches: parentBatches.filter(b => b.trim() !== ''),
      quantity: Number(quantity),
      owner: owner.trim()
    };

    const res = await mergeBatchesToBackend(payload);
    setIsSubmitting(false);

    if (res.success) {
      setMergedResult(payload);
      setIsBackendConnected(res.isBackendConnected);
    } else {
      setErrorMessage(res.error || 'Failed to merge batches');
    }
  };

  // QR Code tracking URL
  const trackingUrl = mergedResult
    ? `${window.location.origin}/#/track/${encodeURIComponent(mergedResult.new_batch_id)}`
    : '';

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', padding: '10px 0 40px 0' }}>

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
              2. ໜ້າໂຮງງານ (Factory Portal) — ລວມລັອດສິນຄ້າຍ່ອຍ (Mass Balance)
            </h1>
          </div>
          <p style={{ fontSize: '12.5px', color: '#4d6052', margin: '4px 0 0 0' }}>
            ລວມວັດຖຸດິບຈາກຫຼາຍຊາວກະສິກອນ • API: <code style={{ background: '#eaf1e5', padding: '2px 6px', borderRadius: '4px', color: '#153826', fontWeight: 700 }}>POST {BACKEND_BASE_URL}/batch/merge</code>
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
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></span>
            Smart Batch Merging
          </span>
          <Link
            to="/ai-dashboard"
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
            <span>ໄປໜ້າ AI Dashboard</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Main Grid: Merge Form Left, QR Generator Right */}
      <div style={{ display: 'grid', gridTemplateColumns: mergedResult ? '1fr 1fr' : '1.2fr 0.8fr', gap: '20px' }}>

        {/* 1. Dynamic Merge Form */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #d5dfce',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#142a1d', margin: '0 0 16px 0', borderBottom: '1px solid #edf2e7', paddingBottom: '10px' }}>
            ຟອມລວມລັອດສົ່ງອອກ (Merge Batches)
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* New Batch ID */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#142a1d' }}>
                  ລະຫັດລັອດໃໝ່ຂອງໂຮງງານ (new_batch_id): <span style={{ color: '#b45309' }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setNewBatchId('FACTORY-' + Math.floor(100 + Math.random() * 900))}
                  style={{ background: 'none', border: 'none', color: '#153826', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
                >
                  <RefreshCw size={11} />
                  <span>ສຸ່ມລະຫັດ</span>
                </button>
              </div>
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
                  fontSize: '13.5px',
                  fontWeight: 800,
                  color: '#0284c7',
                  letterSpacing: '0.3px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Product Name */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
                ຊື່ສິນຄ້າແປຮູບແລ້ວ (product_name): <span style={{ color: '#b45309' }}>*</span>
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

            {/* Dynamic Parent Batches Input (MANDATORY in brief) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#153826' }}>
                  ລະຫັດລັອດຍ່ອຍຕົ້ນທາງ (parent_batches): <span style={{ color: '#b45309' }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddParentBatch}
                  style={{
                    background: '#eaf1e5',
                    color: '#153826',
                    border: '1px solid #c2cfba',
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
                  <Plus size={13} />
                  <span>ເພີ່ມລັອດຍ່ອຍ (+)</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {parentBatches.map((batchCode, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11.5px', color: '#4d6052', width: '24px', fontWeight: 700 }}>
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={batchCode}
                      onChange={(e) => handleParentBatchChange(idx, e.target.value)}
                      placeholder={`ຕົວຢ່າງ: BATCH-LAO-00${idx + 1}`}
                      required
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1.5px solid #d5dfce',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        color: '#142a1d'
                      }}
                    />
                    {parentBatches.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveParentBatch(idx)}
                        style={{
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        title="ລຶບລັອດນີ້"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
                  ນ້ຳໜັກລວມ (quantity kg): <span style={{ color: '#b45309' }}>*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #d5dfce',
                    fontSize: '13px',
                    color: '#142a1d',
                    fontWeight: 700,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
                  ຊື່ໂຮງງານ (owner): <span style={{ color: '#b45309' }}>*</span>
                </label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1.5px solid #d5dfce',
                    fontSize: '12px',
                    color: '#142a1d',
                    boxSizing: 'border-box'
                  }}
                />
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
                marginTop: '8px',
                padding: '12px 20px',
                background: '#153826',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
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
                <span>ກຳລັງປະມວນຜົນລວມລັອດ...</span>
              ) : (
                <>
                  <Layers size={18} />
                  <span>ຢືນຢັນລວມລັອດ & ສ້າງ QR Code ສົ່ງອອກ</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* 2. QR Code Display Right Column (MANDATORY in brief) */}
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
                marginBottom: '12px'
              }}>
                <CheckCircle2 size={14} />
                <span>ລວມລັອດສຳເລັດ (Mass Balance Merged)</span>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0284c7', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>
                {mergedResult.new_batch_id}
              </h3>
              <div style={{ fontSize: '13px', color: '#142a1d', fontWeight: 700 }}>
                {mergedResult.product_name} • {mergedResult.quantity.toLocaleString()} kg
              </div>
              <div style={{ fontSize: '11.5px', color: '#4d6052', marginTop: '3px', marginBottom: '14px' }}>
                ລວມຈາກ {mergedResult.parent_batches.length} ລັອດ: {mergedResult.parent_batches.join(', ')}
              </div>

              {/* QR Code Container */}
              <div style={{
                background: '#ffffff',
                padding: '14px',
                borderRadius: '8px',
                border: '2px solid #153826',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                marginBottom: '16px'
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(trackingUrl)}`}
                  alt="Factory Merged QR"
                  style={{ width: '200px', height: '200px', display: 'block' }}
                />
              </div>

              {/* Action Buttons */}
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
                  <Printer size={14} />
                  <span>ພິມ QR ຕູ້ສິນຄ້າ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(trackingUrl);
                    alert('ຄັດລອກລິ້ງແລ້ວ!');
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
                  <Share2 size={14} />
                  <span>ຄັດລອກລິ້ງ</span>
                </button>
              </div>

              {/* Next Step: Open Customs or Tracking */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <Link
                  to="/customs"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px',
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
                  <span>ສົ່ງໄປກວດປ່ອຍຜ່ານດ່ານສຸລະກາກອນ (/customs)</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  to={`/track/${encodeURIComponent(mergedResult.new_batch_id)}`}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px',
                    background: '#ffffff',
                    color: '#153826',
                    border: '1px solid #d5dfce',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span>ເບິ່ງໜ້າຕິດຕາມຜູ້ບໍລິໂພກ (/track)</span>
                </Link>
              </div>
            </div>
          ) : (
            <div style={{
              background: '#f8fafc',
              border: '2px dashed #cbd5e1',
              borderRadius: '8px',
              padding: '36px 20px',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <QrCode size={48} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#334155' }}>
                QR Code Generator ຈະສະແດງຢູ່ນີ້
              </div>
              <p style={{ fontSize: '12.5px', maxWidth: '280px', margin: '8px auto 0 auto', lineHeight: 1.5 }}>
                ເມື່ອກອກຂໍ້ມູນ ແລະ ກົດ "ຢືນຢັນລວມລັອດ", ລະບົບຈະສ້າງ QR Code ສິນຄ້າລັອດໃຫຍ່ຂຶ້ນມາທັນທີເພື່ອຕິດຂ້າງຕູ້ຄອນເທນເນີ.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
