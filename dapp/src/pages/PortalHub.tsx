import React from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  Factory,
  ShieldCheck,
  ArrowRight,
  Globe2,
  Cpu,
  Database,
  CheckCircle2,
  QrCode,
  Shield,
  TrainTrack
} from 'lucide-react';

export const PortalHub: React.FC = () => {
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 24px 60px 24px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* 1. Official Government Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 900,
              color: '#142a1d',
              margin: '0 0 10px 0',
              lineHeight: 1.25,
              letterSpacing: '-0.4px'
            }}>
              ລະບົບຕິດຕາມ ແລະ ກວດສອບຍ້ອນກັບສິນຄ້າກະສິກຳ ແລະ ສັດລ້ຽງແຫ່ງຊາດ
            </h1>
            <p style={{
              fontSize: '15px',
              color: '#4d6052',
              maxWidth: '820px',
              margin: 0,
              lineHeight: 1.65
            }}>
              ພື້ນຖານໂຄງລ່າງດິຈິຕອນລະດັບຊາດ ຄຸ້ມຄອງໂດຍ ກະຊວງກະສິກຳ ແລະ ປ່າໄມ້ (MAF) ແລະ ກົມພາສີ ກະຊວງການເງິນ ເພື່ອເຊື່ອມຕໍ່ຕ່ອງໂສ້ຄຸນຄ່າກະສິກຳລາວສູ່ສະຫະພາບເອີຣົບ (EUDR TRACES) ແລະ ດ່ານສາກົນໂມ່ຫານ ສປ ຈີນ (GACC e-Phyto) ດ້ວຍເທັກໂນໂລຊີ Web 2.5 Consortium Blockchain.
            </p>
          </div>

          <Link
            to="/customs/trace/LA-COF-2026-001"
            style={{
              padding: '12px 24px',
              background: '#153826',
              color: '#f4f7f0',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 3px 12px rgba(21, 56, 38, 0.25)',
              transition: 'background 0.2s',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={16} />
            <span>ກວດສອບຄວາມຈິງດຽວລະດັບຊາດ (Audit Trail)</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* 2. Official National Trust & Compliance Metrics (Elevating Credibility) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '14px',
        marginBottom: '38px'
      }}>
        {/* Metric 1 */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #d5dfce',
          borderRadius: '10px',
          padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(21, 56, 38, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '18px' }}>🏛️</span>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#4d6052', letterSpacing: '0.5px' }}>
              ລັດຖະບານຮັບຮອງ (State Certified)
            </span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#153826' }}>
            ດຳລັດເລກທີ 328/ລບ
          </div>
          <div style={{ fontSize: '11.5px', color: '#55685a', marginTop: '3px' }}>
            ມາດຕະຖານແຫ່ງຊາດ MAF & MOIC ຮອງຮັບກົດໝາຍ 100%
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #d5dfce',
          borderRadius: '10px',
          padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(21, 56, 38, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '18px' }}>🇪🇺</span>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#4d6052', letterSpacing: '0.5px' }}>
              EUDR Deforestation Due Diligence
            </span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#153826' }}>
            Reg (EU) 2023/1115
          </div>
          <div style={{ fontSize: '11.5px', color: '#55685a', marginTop: '3px' }}>
            Sentinel-2 Geofencing (Cutoff 31/12/2020)
          </div>
        </div>

        {/* Metric 3 */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #d5dfce',
          borderRadius: '10px',
          padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(21, 56, 38, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '18px' }}>🇨🇳</span>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#4d6052', letterSpacing: '0.5px' }}>
              ດ່ານສາກົນໂມ່ຫານ (GACC China)
            </span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#153826' }}>
            e-Phyto Fast-Pass 15 Min
          </div>
          <div style={{ fontSize: '11.5px', color: '#55685a', marginTop: '3px' }}>
            ແປພາສາຈີນລ່ວງໜ້າ IPPC XML Interoperable
          </div>
        </div>

        {/* Metric 4 */}
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #d5dfce',
          borderRadius: '10px',
          padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(21, 56, 38, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '18px' }}>⛓️</span>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#4d6052', letterSpacing: '0.5px' }}>
              Consortium Blockchain Security
            </span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#153826' }}>
            LAB Chain (5222)
          </div>
          <div style={{ fontSize: '11.5px', color: '#55685a', marginTop: '3px' }}>
            Ed25519 Immutable Proofs • PoA State Nodes
          </div>
        </div>
      </div>

      {/* 3 Portal Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px', marginBottom: '44px' }}>
        
        {/* Card 1: Farmer App (Dark Forest Green Highlight Card) */}
        <div style={{
          background: '#153826',
          borderRadius: '12px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(21, 56, 38, 0.16)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e2ead8'
            }}>
              <Smartphone size={22} />
            </div>
            <span style={{
              fontSize: '10px',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#d3e2d6',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 800
            }}>
              ກົມປູກຝັງ MAF
            </span>
          </div>

          <div style={{ fontSize: '11px', letterSpacing: '1px', color: '#a3c2aa', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
            PORTAL 1 · FARMER & BUYING STATION
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 10px 0', color: '#ffffff' }}>
            ແອັບຊາວກະສິກອນ ແລະ ລານຮັບຊື້
          </h2>
          <p style={{ fontSize: '13.5px', color: '#d3e2d6', marginBottom: '22px', lineHeight: 1.6 }}>
            ໜັງສືເດີນທາງສິນຄ້າດິຈິຕອນ ແຕ້ມແປງປູກ Polygon GeoJSON ເທິງແຜນທີ່ດາວທຽມ ແລະ ກວດສອບດາວທຽມ Sentinel-2 EUDR ບໍ່ບຸກລຸກປ່າໄມ້.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            <Link to="/farmer/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', color: '#ffffff', textDecoration: 'none', fontSize: '12.5px', fontWeight: 700 }}>
              <span>1. ເຂົ້າສູ່ລະບົບບັດປະຈຳຕົວຊາວກະສິກອນ (KYC)</span>
              <ArrowRight size={14} color="#a3c2aa" />
            </Link>
            <Link to="/farmer/map" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', color: '#ffffff', textDecoration: 'none', fontSize: '12.5px', fontWeight: 700 }}>
              <span>2. ປັກໝຸດພິກັດແປງປູກ (Farm Polygon GPS)</span>
              <ArrowRight size={14} color="#a3c2aa" />
            </Link>
            <Link to="/farmer/register" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.16)', borderRadius: '6px', color: '#ffffff', textDecoration: 'none', fontSize: '12.5px', fontWeight: 800 }}>
              <span>3. ລົງທະບຽນລັອດ + ກວດດາວທຽມ EUDR ★</span>
              <ArrowRight size={14} color="#ffffff" />
            </Link>
          </div>

          <Link
            to="/farmer/register"
            style={{
              marginTop: 'auto',
              padding: '11px 20px',
              background: '#e2ead8',
              color: '#153826',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              textDecoration: 'none',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>ເປີດແອັບຊາວກະສິກອນ</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Card 2: Factory & Exporter */}
        <div style={{
          background: '#e1e9d8',
          border: '1.5px solid #ccd8be',
          borderRadius: '12px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 12px rgba(21, 56, 38, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#153826',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}>
              <Factory size={22} />
            </div>
            <span style={{
              fontSize: '10px',
              background: '#ffffff',
              border: '1px solid #cdd8c4',
              color: '#153826',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 800
            }}>
              ກົມອຸດສາຫະກຳ & ການຄ້າ
            </span>
          </div>

          <div style={{ fontSize: '11px', letterSpacing: '1px', color: '#4d6052', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
            PORTAL 2 · FACTORY & EXPORTER
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 10px 0', color: '#142a1d' }}>
            ໂຮງງານແປຮູບ ແລະ ຜູ້ສົ່ງອອກ
          </h2>
          <p style={{ fontSize: '13.5px', color: '#4d6052', marginBottom: '22px', lineHeight: 1.6 }}>
            ລະບົບຮວມລັອດຕາມຫຼັກ Mass Balance (ISO 22005) ຮອງຮັບການແປງວັດຖຸດິບເປັນສິນຄ້າສົ່ງອອກ ແລະ ອັບໂຫຼດ e-Phyto ແປພາສາຈີນດ້ວຍ AI OCR.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            <Link to="/factory/dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', border: '1px solid #d5dfce', borderRadius: '6px', color: '#142a1d', textDecoration: 'none', fontSize: '12.5px', fontWeight: 700 }}>
              <span>1. ພາບລວມໂຮງງານ (Factory Overview)</span>
              <ArrowRight size={14} color="#153826" />
            </Link>
            <Link to="/factory/batches" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', border: '1px solid #d5dfce', borderRadius: '6px', color: '#142a1d', textDecoration: 'none', fontSize: '12.5px', fontWeight: 700 }}>
              <span>2. ຮວມລັອດສິນຄ້າ (Mass Balance Merge)</span>
              <ArrowRight size={14} color="#153826" />
            </Link>
            <Link to="/factory/ocr" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', border: '1px solid #d5dfce', borderRadius: '6px', color: '#142a1d', textDecoration: 'none', fontSize: '12.5px', fontWeight: 800 }}>
              <span>3. ຍື່ນເອກະສານດ່ານ & AI OCR ແປພາສາຈີນ</span>
              <ArrowRight size={14} color="#153826" />
            </Link>
          </div>

          <Link
            to="/factory/batches"
            style={{
              marginTop: 'auto',
              padding: '11px 20px',
              background: '#153826',
              color: '#f4f7f0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              textDecoration: 'none',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>ເຂົ້າສູ່ລະບົບໂຮງງານ</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Card 3: Customs & Traceability */}
        <div style={{
          background: '#e1e9d8',
          border: '1.5px solid #ccd8be',
          borderRadius: '12px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 12px rgba(21, 56, 38, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#153826',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}>
              <ShieldCheck size={22} />
            </div>
            <span style={{
              fontSize: '10px',
              background: '#ffffff',
              border: '1px solid #cdd8c4',
              color: '#153826',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 800
            }}>
              ກົມພາສີ & GACC
            </span>
          </div>

          <div style={{ fontSize: '11px', letterSpacing: '1px', color: '#4d6052', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
            PORTAL 3 · VERIFICATION & AUDIT
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 10px 0', color: '#142a1d' }}>
            ດ່ານສຸລະກາກອນ ແລະ ຄວາມໂປ່ງໃສ
          </h2>
          <p style={{ fontSize: '13.5px', color: '#4d6052', marginBottom: '22px', lineHeight: 1.6 }}>
            ໜ້າເອກະສານຄວາມຈິງດຽວລະດັບຊາດ (Single Source of Truth) ເຊື່ອມຕໍ່ລະບົບ GACC ດ່ານໂມ່ຫານ ແລະ ປ່ອຍສິນຄ້າຜ່ານຊ່ອງຂຽວພາຍໃນ 15 ນາທີ.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            <Link to="/customs/scan" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', border: '1px solid #d5dfce', borderRadius: '6px', color: '#142a1d', textDecoration: 'none', fontSize: '12.5px', fontWeight: 700 }}>
              <span>1. ສະແກນ QR / ຄົ້ນຫາລະຫັດສິນຄ້າ</span>
              <ArrowRight size={14} color="#153826" />
            </Link>
            <Link to="/customs/trace/LA-COF-2026-001" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', border: '1.5px solid #153826', borderRadius: '6px', color: '#142a1d', textDecoration: 'none', fontSize: '12.5px', fontWeight: 800 }}>
              <span>2. ຄວາມຈິງດຽວລະດັບຊາດ (Audit Trail) ★</span>
              <ArrowRight size={14} color="#153826" />
            </Link>
            <Link to="/customs/release" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', border: '1px solid #d5dfce', borderRadius: '6px', color: '#142a1d', textDecoration: 'none', fontSize: '12.5px', fontWeight: 700 }}>
              <span>3. ໃບອະນຸຍາດຜ່ານດ່ານຊ່ອງຂຽວ (15 ນາທີ)</span>
              <ArrowRight size={14} color="#153826" />
            </Link>
          </div>

          <Link
            to="/customs/trace/LA-COF-2026-001"
            style={{
              marginTop: 'auto',
              padding: '11px 20px',
              background: '#153826',
              color: '#f4f7f0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              textDecoration: 'none',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>ກວດສອບດ່ານສາກົນ</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* 4. Contrast Banner Section: Fast-Track Lao-China Rail Clearance */}
      <div style={{
        background: '#153826',
        borderRadius: '12px',
        padding: '36px 40px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '28px',
        marginBottom: '44px',
        boxShadow: '0 10px 30px rgba(21, 56, 38, 0.2)',
        border: '1.5px solid #235239'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <TrainTrack size={16} color="#a3c2aa" />
            <span style={{ fontSize: '11.5px', letterSpacing: '1.5px', color: '#a3c2aa', fontWeight: 800, textTransform: 'uppercase' }}>
              FAST-TRACK CROSS BORDER CLEARANCE PROTOCOL
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 10px 0', lineHeight: 1.3, color: '#ffffff' }}>
            ຂະບວນລົດໄຟຂົນສົ່ງສິນຄ້າ ລາວ-ຈີນ (LX-802) ປ່ອຍຜ່ານດ່ານຊ່ອງຂຽວດ່ວນພາຍໃນ 15 ນາທີ
          </h2>
          <p style={{ fontSize: '13.5px', color: '#d3e2d6', margin: '0 0 20px 0', lineHeight: 1.6 }}>
            ລະບົບສົ່ງຂໍ້ມູນໃບຮັບຮອງສຸຂານາໄມພືດ e-Phyto (ແປພາສາຈີນ GACC) ແລະ ພິກັດແປງປູກ EUDR ໄປລ່ວງໜ້າ ເຮັດໃຫ້ດ່ານໂມ່ຫານປ່ອຍຂະບວນລົດໄຟໄດ້ທັນທີ ໂດຍບໍ່ຕ້ອງກັກກວດກາຊ້ຳຊ້ອນ.
          </p>
          <Link
            to="/customs/release"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              background: '#e2ead8',
              color: '#153826',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            <CheckCircle2 size={16} />
            <span>ເບິ່ງໃບອະນຸຍາດຊ່ອງຂຽວ (Green Channel Fast-Pass)</span>
          </Link>
        </div>

        {/* Right Preview Feature Box */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          padding: '22px 26px',
          minWidth: '290px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode size={18} color="#a3c2aa" />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#e2ead8' }}>Master Batch: LA-COF-2026-001</span>
          </div>
          <div style={{ fontSize: '12px', color: '#d3e2d6', lineHeight: 1.6 }}>
            • ສິນຄ້າ: ກາເຟອາຣາບິກາ (15,400 ກກ)<br />
            • ສະຖານະ EUDR: ບໍ່ຕັດໄມ້ທຳລາຍປ່າ (NDVI: 0.84)<br />
            • Blockchain Anchor: Block #1,842,910<br />
            • ຕູ້ຄອນເທນເນີ: TGHU-992140-7<br />
            • ດ່ານກວດ: ບໍ່ເຕັນ (LA) ⇌ ໂມ່ຫານ (CN)
          </div>
          <div style={{
            fontSize: '11px',
            color: '#a3c2aa',
            background: 'rgba(0,0,0,0.25)',
            padding: '6px 10px',
            borderRadius: '4px',
            letterSpacing: '0.3px'
          }}>
            Tx: 0x7e2b19f4a8c3d0f7a6b5c4e2...
          </div>
        </div>
      </div>

      {/* 5. Tech Architecture & Verification Standard Highlights */}
      <div style={{
        background: '#e1e9d8',
        border: '1.5px solid #ccd8be',
        borderRadius: '12px',
        padding: '30px 32px',
        boxShadow: '0 2px 10px rgba(21, 56, 38, 0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#142a1d' }}>
            ຈຸດເດັ່ນທາງສະຖາປັດຕະຍະກຳ ແລະ ຄວາມປອດໄພລະດັບຊາດ (System Architecture)
          </h3>
          <span style={{ fontSize: '11.5px', color: '#153826', fontWeight: 800 }}>
            ISO/IEC 27001 & UN/CEFACT Compliant
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#153826', flexShrink: 0 }}>
              <Globe2 size={18} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#142a1d', marginBottom: '3px' }}>Web 2.5 Relayer</div>
              <div style={{ fontSize: '12.5px', color: '#4d6052', lineHeight: 1.5 }}>ຜູ້ໃຊ້ບໍ່ຕ້ອງມີກະເປົາ Crypto ຫຼັງບ້ານຈ່າຍຄ່າ Gas ດ້ວຍຫຼຽນ LAB ບົນເຄືອຂ່າຍ LAB Chain (5222)</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#153826', flexShrink: 0 }}>
              <Cpu size={18} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#142a1d', marginBottom: '3px' }}>Dual AI Engines</div>
              <div style={{ fontSize: '12.5px', color: '#4d6052', lineHeight: 1.5 }}>ກວດດາວທຽມ Sentinel-2 (EUDR 2020) + ສະແກນ e-Phyto ແປພາສາຈີນອັດຕະໂນມັດ</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#153826', flexShrink: 0 }}>
              <Database size={18} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#142a1d', marginBottom: '3px' }}>Hybrid IPFS Storage</div>
              <div style={{ fontSize: '12.5px', color: '#4d6052', lineHeight: 1.5 }}>ເກັບໄຟລ໌ໃຫຍ່ບົນ IPFS ປະທັບຕາສະເພາະ CID ບົນບລັອກເຊນ ປະຢັດຄ່າ Gas &gt;95%</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
