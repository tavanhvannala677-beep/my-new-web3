import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Printer, Shield, Lock, Award, FileCheck2 } from 'lucide-react';

export const GreenChannelRelease: React.FC = () => {
  const releaseTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

  return (
    <div style={{ maxWidth: '820px', margin: '24px auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Link to="/customs/trace/LA-COF-2026-001" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#153826', textDecoration: 'none', fontSize: '13px', fontWeight: 800 }}>
        <ArrowLeft size={16} />
        <span>ກັບຄືນໄປໜ້າຄວາມຈິງດຽວລະດັບຊາດ (Back to Single Source of Truth)</span>
      </Link>

      {/* Official State Certificate Card */}
      <div style={{
        background: '#ffffff',
        border: '2px solid #153826',
        borderRadius: '12px',
        padding: '36px',
        boxShadow: '0 8px 30px rgba(21, 56, 38, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Certificate Watermark / Header */}
        <div style={{ textAlign: 'center', borderBottom: '1.5px solid #d5dfce', paddingBottom: '22px', marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px' }}>🇱🇦</span>
            <span style={{ fontSize: '18px', color: '#708375', fontWeight: 700 }}>⇄</span>
            <span style={{ fontSize: '28px' }}>🇨🇳</span>
          </div>
          <div style={{ fontSize: '11px', letterSpacing: '1px', color: '#153826', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>
            ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ · ກົມພາສີ & GACC ສປ ຈີນ
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#142a1d', margin: '4px 0 2px 0' }}>
            ໃບອະນຸຍາດປ່ອຍສິນຄ້າຜ່ານດ່ານຊ່ອງຂຽວ (Green Channel Fast-Pass)
          </h1>
          <div style={{ fontSize: '12px', color: '#4d6052' }}>
            磨憨口岸跨境快速放行凭单 · Bilateral Fast-Track Release Protocol &lt; 15 Minutes
          </div>
        </div>

        {/* Big Approved Stamp */}
        <div style={{
          background: '#153826',
          borderRadius: '8px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(21, 56, 38, 0.18)',
          border: '1.5px solid #235239'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#86efac' }}>
              <CheckCircle2 size={30} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff' }}>
                RELEASED VIA GREEN CHANNEL (准予放行)
              </div>
              <div style={{ fontSize: '12px', color: '#d3e2d6' }}>
                ອະນຸມັດປ່ອຍຂະບວນລົດໄຟຂົນສົ່ງສິນຄ້າຜ່ານດ່ານໂມ່ຫານ ໂດຍບໍ່ຕ້ອງກັກກວດກາຊ້ຳຊ້ອນ
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#a3c2aa' }}>ເວລາປ່ອຍຜ່ານດ່ານ (Release Time):</div>
            <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#ffffff' }}>
              {releaseTime}
            </div>
          </div>
        </div>

        {/* Certificate Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', fontSize: '13px', marginBottom: '24px' }}>
          <div style={{ background: '#edf4e8', border: '1px solid #d5dfce', padding: '14px', borderRadius: '8px' }}>
            <span style={{ color: '#4d6052', fontSize: '11px', display: 'block', fontWeight: 700 }}>ຂະບວນລົດໄຟຂົນສົ່ງສິນຄ້າ (Train No.):</span>
            <strong style={{ color: '#142a1d', fontSize: '14px' }}>Lao-China Cargo LX-802</strong>
          </div>

          <div style={{ background: '#edf4e8', border: '1px solid #d5dfce', padding: '14px', borderRadius: '8px' }}>
            <span style={{ color: '#4d6052', fontSize: '11px', display: 'block', fontWeight: 700 }}>ຕູ້ຄອນເທນເນີ (Container Seal ID):</span>
            <strong style={{ color: '#153826', fontSize: '14px', letterSpacing: '0.3px' }}>TGHU-992140-7</strong>
          </div>

          <div style={{ background: '#edf4e8', border: '1px solid #d5dfce', padding: '14px', borderRadius: '8px' }}>
            <span style={{ color: '#4d6052', fontSize: '11px', display: 'block', fontWeight: 700 }}>ລະຫັດຊຸດສິນຄ້າ (Master Batch):</span>
            <strong style={{ color: '#142a1d', fontSize: '14px', letterSpacing: '0.3px' }}>LA-COF-2026-001</strong>
          </div>

          <div style={{ background: '#edf4e8', border: '1px solid #d5dfce', padding: '14px', borderRadius: '8px' }}>
            <span style={{ color: '#4d6052', fontSize: '11px', display: 'block', fontWeight: 700 }}>ເຈົ້າໜ້າທີ່ດ່ານສາກົນຜູ້ອະນຸມັດ (Officer):</span>
            <strong style={{ color: '#153826', fontSize: '14px' }}>GACC Mohan Officer #8812</strong>
          </div>
        </div>

        {/* Official Cryptographic Signature & Digital Stamp */}
        <div style={{
          borderTop: '1.5px solid #d5dfce',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          fontSize: '11.5px',
          color: '#4d6052'
        }}>
          <div>
            <div style={{ fontWeight: 800, color: '#142a1d' }}>
              Consortium LAB Chain Block Anchor: #1,842,910 (PoA State Node)
            </div>
            <div style={{ color: '#153826', marginTop: '2px', fontWeight: 700 }}>
              Tx: 0x7e2b19f4a8c3d0f7a6b5c4e2d1a0b9c8d7e6f3f9...
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            style={{
              padding: '10px 20px',
              background: '#153826',
              color: '#f4f7f0',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(21, 56, 38, 0.2)'
            }}
          >
            <Printer size={15} />
            <span>ພິມໃບຢັ້ງຢືນທາງການ (Print Official Certificate)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
