import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Search, ShieldCheck, ArrowRight, Camera } from 'lucide-react';
import { getStoredBatches } from '../../services/mockData';

export const ScanAndSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const batches = getStoredBatches();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    navigate(`/customs/trace/${searchId.trim()}`);
  };

  const handleSimulateScan = (batchId: string) => {
    setIsCameraActive(true);
    setTimeout(() => {
      setIsCameraActive(false);
      navigate(`/customs/trace/${batchId}`);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: '#153826',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          color: '#e2ead8',
          boxShadow: '0 4px 14px rgba(21, 56, 38, 0.2)'
        }}>
          <ShieldCheck size={28} />
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#142a1d', margin: '0 0 8px 0' }}>
          ລະບົບກວດສອບດ່ານສຸລະກາກອນ ແລະ ຄວາມໂປ່ງໃສ
        </h1>
        <p style={{ fontSize: '14px', color: '#4d6052', margin: 0, lineHeight: 1.6 }}>
          ລະບົບກວດສອບຍ້ອນກັບສິນຄ້າກະສິກຳ ແລະ ສັດລ້ຽງ ດ່ານສາກົນໂມ່ຮານ (Mohan GACC) ແລະ ດ່ານບໍ່ເຕັນ (Boten)
          ຢັ້ງຢືນຄວາມຖືກຕ້ອງບົນ LAB Chain (Chain ID: 5222)
        </p>
      </div>

      {/* Camera Scanner Simulation */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #d5dfce',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(21, 56, 38, 0.04)'
      }}>
        {isCameraActive ? (
          <div style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '110px', height: '110px', border: '3px solid #153826', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="animate-pulse">
              <QrCode size={60} color="#153826" />
            </div>
            <div style={{ fontSize: '14px', color: '#153826', fontWeight: 800 }}>
              ກຳລັງສະແກນ QR Code ຕູ້ຄອນເທນເນີ...
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#e1e9d8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#153826'
            }}>
              <Camera size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#142a1d', margin: '0 0 6px 0', fontWeight: 800 }}>ເປີດກ້ອງເພື່ອສະແກນ QR Code</h3>
              <p style={{ fontSize: '13px', color: '#4d6052', margin: 0 }}>
                ສະແກນປ້າຍ QR ປະຈຳຕູ້ຄອນເທນເນີ ບົນຂະບວນລົດໄຟຂົນສົ່ງສິນຄ້າ ລາວ-ຈີນ
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSimulateScan('LA-COF-2026-001')}
              style={{
                padding: '12px 24px',
                background: '#153826',
                color: '#f4f7f0',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 3px 10px rgba(21, 56, 38, 0.25)'
              }}
            >
              <QrCode size={16} />
              <span>ເປີດກ້ອງສະແກນ (Simulate Scan)</span>
            </button>
          </div>
        )}
      </div>

      {/* Manual Search by Batch ID (Clean Pill Style) */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} color="#708375" style={{ position: 'absolute', left: '16px', top: '14px' }} />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="ຫຼື ພິມລະຫັດ Batch ID ເຊັ່ນ LA-COF-2026-001"
            style={{
              width: '100%',
              padding: '12px 18px 12px 42px',
              background: '#ffffff',
              border: '1px solid #cdd8c4',
              borderRadius: '8px',
              color: '#142a1d',
              fontSize: '13.5px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '0 24px',
            background: '#153826',
            color: '#f4f7f0',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(21, 56, 38, 0.2)'
          }}
        >
          <span>ຄົ້ນຫາ</span>
          <ArrowRight size={15} />
        </button>
      </form>

      {/* Sample Batches Quick Buttons */}
      <div style={{ background: '#e1e9d8', border: '1px solid #ccd8be', borderRadius: '12px', padding: '18px 20px' }}>
        <div style={{ fontSize: '12px', color: '#153826', marginBottom: '10px', fontWeight: 800 }}>
          ຫຼື ຄລິກທົດສອບເບິ່ງຕົວຢ່າງລັອດສິນຄ້າໃນລະບົບ:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {batches.map((b) => (
            <button
              key={b.batchId}
              type="button"
              onClick={() => navigate(`/customs/trace/${b.batchId}`)}
              style={{
                padding: '7px 14px',
                background: '#ffffff',
                color: '#153826',
                border: '1px solid #cdd8c4',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <span style={{ letterSpacing: '0.3px' }}>{b.batchId}</span>
              <span style={{ color: '#4d6052', fontSize: '11px', fontWeight: 500 }}>
                ({b.productType.replace('_', ' ')})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
