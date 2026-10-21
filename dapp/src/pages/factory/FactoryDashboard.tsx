import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, FileText, ArrowRight } from 'lucide-react';
import { getStoredBatches } from '../../services/mockData';

export const FactoryDashboard: React.FC = () => {
  const batches = getStoredBatches();
  const totalVolume = batches.reduce((acc, b) => acc + b.quantityKg, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
          ພາບລວມການດຳເນີນງານໂຮງງານ ແລະ ການສົ່ງອອກ
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          ສູນຄວບຄຸມການແປຮູບ, ຮວມລັອດສິນຄ້າ (Mass Balance) ແລະ ກະກຽມເອກະສານສົ່ງອອກດ່ານສາກົນ ລາວ-ຈີນ
        </p>
      </div>

      {/* KPI Stats Grid (Inspired by the Reference Palette) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Flagship KPI: Dark Forest Green Card */}
        <div style={{ background: '#153826', borderRadius: '12px', padding: '20px', color: '#ffffff', boxShadow: '0 4px 14px rgba(21, 56, 38, 0.15)' }}>
          <div style={{ fontSize: '12px', color: '#a3c2aa', fontWeight: 700, marginBottom: '6px' }}>ປະລິມານສິນຄ້າລວມ (Total Volume)</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff' }}>
            {(totalVolume / 1000).toFixed(1)} <span style={{ fontSize: '15px', fontWeight: 600, color: '#d3e2d6' }}>MT (ໂຕນ)</span>
          </div>
          <div style={{ fontSize: '11px', color: '#a3c2aa', marginTop: '6px', fontWeight: 600 }}>● ພ້ອມສົ່ງອອກທາງລົດໄຟ ລາວ-ຈີນ</div>
        </div>

        {/* Sage Card 2 */}
        <div style={{ background: '#e1e9d8', border: '1px solid #ccd8be', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#4d6052', fontWeight: 700, marginBottom: '6px' }}>ຈຳນວນລັອດສິນຄ້າທັງໝົດ</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#153826' }}>{batches.length}</div>
          <div style={{ fontSize: '11px', color: '#153826', marginTop: '6px', fontWeight: 700 }}>● 100% ຜ່ານການກວດ EUDR</div>
        </div>

        {/* Sage Card 3 */}
        <div style={{ background: '#e1e9d8', border: '1px solid #ccd8be', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#4d6052', fontWeight: 700, marginBottom: '6px' }}>ຄວາມພ້ອມຜ່ານດ່ານຊ່ອງຂຽວ</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#153826' }}>95.4%</div>
          <div style={{ fontSize: '11px', color: '#153826', marginTop: '6px', fontWeight: 700 }}>ດ່ານໂມ່ຮານກວດປ່ອຍ &lt; 15 ນາທີ</div>
        </div>

        {/* Sage Card 4 */}
        <div style={{ background: '#e1e9d8', border: '1px solid #ccd8be', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#4d6052', fontWeight: 700, marginBottom: '6px' }}>ສະຖານະບລັອກເຊນ Labchain</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#153826', marginTop: '4px' }}>ເຊື່ອມຕໍ່ແລ້ວ</div>
          <div style={{ fontSize: '11px', color: '#4d6052', marginTop: '6px', fontWeight: 600 }}>Chain ID: 5222 (Immutable)</div>
        </div>
      </div>

      {/* Action Banners */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginTop: '8px' }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #d5dfce',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(21, 56, 38, 0.04)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#153826', marginBottom: '8px' }}>
              <Layers size={18} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#142a1d' }}>
                ຮວມລັອດສິນຄ້າ (Mass Balance Processing)
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#4d6052', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              ຮວມຜົນຜະລິດມັນຕົ້ນ ຫຼື ເມັດກາເຟຈາກຊາວກະສິກອນຫຼາຍແປງ ເພື່ອແປຮູບເປັນແປ້ງມັນ ຫຼື ກາເຟຂົ້ວ 1 ຕູ້ຄອນເທນເນີ ພ້ອມຄຳນວນສັດສ່ວນ Mass Balance.
            </p>
          </div>
          <Link
            to="/factory/batches"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#153826',
              color: '#f4f7f0',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 800,
              alignSelf: 'flex-start',
              boxShadow: '0 2px 6px rgba(21, 56, 38, 0.2)'
            }}
          >
            <span>ໄປທີ່ຕາຕະລາງຮວມລັອດ (Batch Management)</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #d5dfce',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(21, 56, 38, 0.04)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#153826', marginBottom: '8px' }}>
              <FileText size={18} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#142a1d' }}>
                ຍື່ນເອກະສານດ່ານ & AI OCR (e-Phyto)
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#4d6052', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              ອັບໂຫຼດໃບຢັ້ງຢືນສຸຂານາໄມພືດພາສາລາວ ໃຫ້ລະບົບ AI ສະກັດຂໍ້ມູນ ແລະ ແປເປັນພາສາຈີນ (中文) ລ່ວງໜ້າ ເພື່ອຍິງເຂົ້າດ່ານສຸລະກາກອນຈີນ GACC.
            </p>
          </div>
          <Link
            to="/factory/ocr"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#153826',
              color: '#f4f7f0',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 800,
              alignSelf: 'flex-start',
              boxShadow: '0 2px 6px rgba(21, 56, 38, 0.2)'
            }}
          >
            <span>ອັບໂຫຼດ ແລະ ແປເອກະສານ e-Phyto</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
