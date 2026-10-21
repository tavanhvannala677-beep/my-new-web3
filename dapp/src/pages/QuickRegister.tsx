import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QrCode, CheckCircle2, Globe, ArrowRight, Printer, Share2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { registerBatchToBackend, RegisterBatchPayload, BACKEND_BASE_URL } from '../services/backendApi';

export function QuickRegister() {
  const navigate = useNavigate();

  // Form State
  const [destination, setDestination] = useState<'EU' | 'China'>('EU');
  const [batchId, setBatchId] = useState<string>(() => 'BATCH-LAO-' + Math.floor(100 + Math.random() * 900));
  const [productName, setProductName] = useState<string>('ກາເຟອາຣາບິກາ (Arabica Coffee)');
  const [province, setProvince] = useState<string>('ປາກຊ່ອງ, ຈຳປາສັກ');
  const [ownerWallet, setOwnerWallet] = useState<string>('0x71C6707321eE51f72b3F3E8E349887114A51f72b');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [registeredBatch, setRegisteredBatch] = useState<RegisterBatchPayload | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate unique Batch ID
  const handleRegenerateId = () => {
    setBatchId('BATCH-LAO-' + Math.floor(100 + Math.random() * 900));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const farmLocationWithDest = `${province} (Destination: ${destination})`;
    const payload: RegisterBatchPayload = {
      batch_id: batchId.trim(),
      product_name: productName.trim(),
      farm_location: farmLocationWithDest,
      owner: ownerWallet.trim()
    };

    const result = await registerBatchToBackend(payload);
    setIsSubmitting(false);

    if (result.success) {
      setRegisteredBatch(payload);
      setIsBackendConnected(result.isBackendConnected);
    } else {
      setErrorMessage(result.error || 'Failed to register batch');
    }
  };

  // QR Code URL for Tracking Page
  const trackingUrl = registeredBatch
    ? `${window.location.origin}/#/track/${encodeURIComponent(registeredBatch.batch_id)}`
    : '';

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '10px 0 40px 0' }}>

      {/* Top Banner & Go Backend Info */}
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
            <span style={{ fontSize: '18px' }}>⚡</span>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#153826', margin: 0 }}>
              ລົງທະບຽນສິນຄ້າໃໝ່ (Register Batch API)
            </h1>
          </div>
          <p style={{ fontSize: '12.5px', color: '#4d6052', margin: '4px 0 0 0' }}>
            ເຊື່ອມຕໍ່ກັບ Go Backend: <code style={{ background: '#eaf1e5', padding: '2px 6px', borderRadius: '4px', color: '#153826', fontWeight: 700 }}>{BACKEND_BASE_URL}/batch/register</code>
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
            fontWeight: 700
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></span>
            Port: 4001
          </span>
          <Link
            to="/track/BATCH-LAO-001"
            style={{
              color: '#153826',
              textDecoration: 'none',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              border: '1px solid #d5dfce',
              borderRadius: '6px'
            }}
          >
            <span>ກວດສອບລັອດຕົວຢ່າງ</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Main Grid: Form Left, QR Code Display Right */}
      <div style={{ display: 'grid', gridTemplateColumns: registeredBatch ? 'repeat(auto-fit, minmax(360px, 1fr))' : '1fr', gap: '20px' }}>

        {/* 1. Registration Form */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #d5dfce',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#142a1d', margin: '0 0 16px 0', borderBottom: '1px solid #edf2e7', paddingBottom: '10px' }}>
            1. ຂໍ້ມູນສິນຄ້າ ແລະ ປາຍທາງສົ່ງອອກ (Product & Destination)
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Destination Toggle */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#153826', marginBottom: '8px' }}>
                ປາຍທາງການສົ່ງອອກ (Export Destination): <span style={{ color: '#b45309' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setDestination('EU')}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    border: destination === 'EU' ? '2px solid #153826' : '1px solid #d5dfce',
                    background: destination === 'EU' ? '#eaf1e5' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#153826' }}>🇪🇺 ສະຫະພາບເອີຣົບ (EU)</span>
                    {destination === 'EU' && <CheckCircle2 size={16} color="#153826" />}
                  </div>
                  <span style={{ fontSize: '11px', color: '#4d6052' }}>ກວດສອບດາວທຽມ EUDR ບໍ່ຕັດໄມ້ທຳລາຍປ່າ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDestination('China')}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    border: destination === 'China' ? '2px solid #153826' : '1px solid #d5dfce',
                    background: destination === 'China' ? '#eaf1e5' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#153826' }}>🇨🇳 ສປ ຈີນ (China)</span>
                    {destination === 'China' && <CheckCircle2 size={16} color="#153826" />}
                  </div>
                  <span style={{ fontSize: '11px', color: '#4d6052' }}>AI OCR ໃບສຸຂານາໄມພືດແປພາສາຈີນ GACC</span>
                </button>
              </div>
            </div>

            {/* Batch ID */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#142a1d' }}>
                  ລະຫັດລັອດສິນຄ້າ (batch_id): <span style={{ color: '#b45309' }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateId}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#153826',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 700
                  }}
                >
                  <RefreshCw size={11} />
                  <span>ສຸ່ມລະຫັດໃໝ່</span>
                </button>
              </div>
              <input
                type="text"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #d5dfce',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  color: '#153826',
                  letterSpacing: '0.3px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Product Name */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
                ຊື່ສິນຄ້າ (product_name): <span style={{ color: '#b45309' }}>*</span>
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

            {/* Farm Location */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
                ແຫຼ່ງຜະລິດ / ແປງປູກ (farm_location): <span style={{ color: '#b45309' }}>*</span>
              </label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
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

            {/* Owner Wallet */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#142a1d', marginBottom: '6px' }}>
                ກະເປົາຜູ້ຖືຄອງ / ເຈົ້າຂອງສິດ (owner):
              </label>
              <input
                type="text"
                value={ownerWallet}
                onChange={(e) => setOwnerWallet(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #d5dfce',
                  fontSize: '11.5px',
                  color: '#4d6052',
                  boxSizing: 'border-box'
                }}
              />
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
                <span>ກຳລັງຍິງຂໍ້ມູນເຂົ້າ Go Backend...</span>
              ) : (
                <>
                  <QrCode size={18} />
                  <span>ບັນທຶກສິນຄ້າ & ສ້າງ QR Code ທັນທີ</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* 2. Generated QR Code Card (appears right after submit) */}
        {registeredBatch && (
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
              marginBottom: '14px'
            }}>
              <CheckCircle2 size={14} />
              <span>ລົງທະບຽນສຳເລັດ (Batch Registered)</span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#153826', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>
              {registeredBatch.batch_id}
            </h3>
            <p style={{ fontSize: '13px', color: '#4d6052', margin: '0 0 16px 0' }}>
              {registeredBatch.product_name}
            </p>

            {/* QR Image Box */}
            <div style={{
              background: '#ffffff',
              padding: '14px',
              borderRadius: '8px',
              border: '2px solid #153826',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              marginBottom: '16px'
            }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(trackingUrl)}`}
                alt="Product Batch QR"
                style={{ width: '220px', height: '220px', display: 'block' }}
              />
            </div>

            {/* Backend Connection Indicator */}
            <div style={{
              fontSize: '11.5px',
              color: isBackendConnected ? '#15803d' : '#b45309',
              background: isBackendConnected ? '#ecfdf5' : '#fefce8',
              padding: '6px 12px',
              borderRadius: '6px',
              marginBottom: '16px',
              border: `1px solid ${isBackendConnected ? '#86efac' : '#fde047'}`
            }}>
              {isBackendConnected
                ? '🟢 ບັນທຶກລົງຖານຂໍ້ມູນ Go Backend (Port 4001) ຮຽບຮ້ອຍ'
                : '🟡 ບັນທຶກແບບ Local Preview (ລໍຖ້າເປີດ Go Backend ພອດ 4001)'}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  padding: '9px 12px',
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
                  gap: '6px'
                }}
              >
                <Printer size={14} />
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
                  padding: '9px 12px',
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
                  gap: '6px'
                }}
              >
                <Share2 size={14} />
                <span>ຄັດລອກລິ້ງ QR</span>
              </button>
            </div>

            {/* Open Tracking Page CTA */}
            <Link
              to={`/track/${encodeURIComponent(registeredBatch.batch_id)}`}
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
                gap: '8px'
              }}
            >
              <span>ເປີດໜ້າກວດສອບສະຖານະ (Tracking Page)</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        )}

      </div>

    </div>
  );
}
