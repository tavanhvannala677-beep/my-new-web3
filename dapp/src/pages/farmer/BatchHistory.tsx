import React, { useState } from 'react';
import { getStoredBatches } from '../../services/mockData';
import { BatchItem } from '../../types/traceability';
import { QrCode, CheckCircle2, Calendar, Scale, X } from 'lucide-react';
import { useSeniorMode } from '../../context/SeniorModeContext';

export const BatchHistory: React.FC = () => {
  const { isSeniorMode } = useSeniorMode();
  const [batches] = useState<BatchItem[]>(getStoredBatches());
  const [selectedQrBatch, setSelectedQrBatch] = useState<BatchItem | null>(null);

  const handleOpenQr = (batch: BatchItem) => {
    setSelectedQrBatch(batch);
  };

  const handleCloseQr = () => {
    setSelectedQrBatch(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isSeniorMode ? '18px' : '14px' }}>
      {/* Official Registry Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h2 style={{
            fontSize: isSeniorMode ? '19px' : '17px',
            fontWeight: 900,
            color: '#142a1d',
            margin: 0
          }}>
            ປະຫວັດລັອດ & QR Code ປະຈຳສິນຄ້າແຫ່ງຊາດ
          </h2>
          <span style={{
            background: '#e8f2e2',
            color: '#153826',
            border: '1px solid #c2cfba',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '10px',
            fontWeight: 800
          }}>
            MAF VERIFIED
          </span>
        </div>
        <p style={{ fontSize: isSeniorMode ? '13px' : '11.5px', color: '#4d6052', margin: 0 }}>
          QR Code ດິຈິຕອນ ປະທັບຕາບລັອກເຊນ LAB Chain ສຳລັບຍື່ນດ່ານພາສີ ແລະ ຄົນຂັບລົດຂົນສົ່ງ
        </p>
      </div>

      {/* Batch Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: isSeniorMode ? '16px' : '12px' }}>
        {batches.map((batch) => (
          <div
            key={batch.batchId}
            style={{
              background: '#ffffff',
              border: '2px solid #d5dfce',
              borderRadius: '8px',
              padding: isSeniorMode ? '18px 16px' : '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 4px 12px rgba(21, 56, 38, 0.05)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: isSeniorMode ? '18px' : '14px',
                fontWeight: 900,
                color: '#153826',
                letterSpacing: '0.5px'
              }}>
                {batch.batchId}
              </span>
              <span style={{
                background: '#e1e9d8',
                color: '#153826',
                border: '1px solid #ccd8be',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: isSeniorMode ? '13px' : '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={isSeniorMode ? 16 : 12} />
                <span>ຜ່ານດາວທຽມ EUDR</span>
              </span>
            </div>

            <div style={{
              fontSize: isSeniorMode ? '19px' : '15px',
              fontWeight: 900,
              color: '#142a1d'
            }}>
              {batch.productType === 'Arabica_Cherry'
                ? '☕ ກາເຟອາຣາບິກາ ສົດ'
                : batch.productType === 'Robusta_Cherry'
                ? '🌱 ກາເຟໂຣບັສຕາ ສົດ'
                : '🥔 ຫົວມັນຕົ້ນສົດ'}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: isSeniorMode ? '15px' : '13px',
              color: '#4d6052',
              fontWeight: 700
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Scale size={isSeniorMode ? 18 : 14} color="#153826" />
                <span>{batch.quantityKg.toLocaleString()} ກິໂລ</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={isSeniorMode ? 18 : 14} color="#153826" />
                <span>{batch.harvestDate.substring(0, 10)}</span>
              </div>
            </div>

            {/* Big Senior Touch QR Button */}
            <div style={{
              paddingTop: '8px',
              borderTop: '1px solid #edf4e8'
            }}>
              <button
                type="button"
                onClick={() => handleOpenQr(batch)}
                style={{
                  width: '100%',
                  padding: isSeniorMode ? '14px 18px' : '10px 14px',
                  background: '#153826',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: isSeniorMode ? '16px' : '13px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(21, 56, 38, 0.25)'
                }}
              >
                <QrCode size={isSeniorMode ? 22 : 16} />
                <span>📱 ເປີດ QR Code ໃຫ້ຄົນຂັບລົດສະແກນ</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Giant Fullscreen QR Modal for Elderly Screen Sharing */}
      {selectedQrBatch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '380px',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#153826' }}>
                ໃບກວດກາຜົນຜະລິດກະສິກຳແຫ່ງຊາດ
              </div>
              <button
                type="button"
                onClick={handleCloseQr}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} color="#0f172a" />
              </button>
            </div>

            {/* Giant QR Code Display */}
            <div style={{
              background: '#ffffff',
              padding: '14px',
              borderRadius: '8px',
              border: '3px solid #153826',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                  `https://trace.laochain.la/#/customs/trace/${selectedQrBatch.batchId}`
                )}`}
                alt="Batch QR Code"
                style={{ width: '220px', height: '220px', display: 'block' }}
              />
            </div>

            <div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#153826', letterSpacing: '0.5px' }}>
                {selectedQrBatch.batchId}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#142a1d', marginTop: '4px' }}>
                {selectedQrBatch.quantityKg.toLocaleString()} ກິໂລ • {selectedQrBatch.productType.replace('_', ' ')}
              </div>
            </div>

            <div style={{
              background: '#e8f2e1',
              color: '#153826',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 800,
              width: '100%'
            }}>
              📱 ຍື່ນໜ້າຈໍນີ້ໃຫ້ຄົນຂັບລົດ ຫຼື ດ່ານພາສີສະແກນໄດ້ເລີຍ
            </div>

            <button
              type="button"
              onClick={handleCloseQr}
              style={{
                width: '100%',
                padding: '14px',
                background: '#153826',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              ປິດໜ້າຈໍນີ້ (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
