import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBatchById } from '../../services/mockData';
import { LeafletSatelliteMap } from '../../components/LeafletSatelliteMap';
import {
  ShieldCheck,
  ExternalLink,
  MapPin,
  Clock,
  Globe2,
  TrainTrack,
  CheckCircle2,
  Shield,
  FileCheck2,
  Lock,
  Award
} from 'lucide-react';

export const SingleSourceOfTruth: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const batch = getBatchById(batchId || 'LA-COF-2026-001');

  if (!batch) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ color: '#dc2626' }}>ບໍ່ພົບຂໍ້ມູນລັອດສິນຄ້າ (Batch Not Found)</h2>
        <p style={{ color: '#4d6052' }}>ກະລຸນາກວດສອບລະຫັດ Batch ID ອີກຄັ້ງ</p>
        <Link to="/customs/scan" style={{ color: '#153826', fontWeight: 800 }}>ກັບຄືນໄປໜ້າຄົ້ນຫາ</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      
      {/* 1. Official National Certificate Header Banner */}
      <div style={{
        background: '#153826',
        borderRadius: '10px',
        padding: '24px 28px',
        color: '#ffffff',
        boxShadow: '0 6px 20px rgba(21, 56, 38, 0.16)',
        border: '1.5px solid #235239',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1.5px solid #d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#e2ead8',
            flexShrink: 0
          }}>
            <ShieldCheck size={30} color="#86efac" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#a3c2aa', fontWeight: 800 }}>
                ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ · ຄວາມຈິງດຽວລະດັບຊາດ
              </span>
              <span style={{
                background: '#dcfce7',
                color: '#15803d',
                padding: '1px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 900
              }}>
                STATE VERIFIED
              </span>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: 0, lineHeight: 1.3 }}>
              ໃບຢັ້ງຢືນການກວດສອບຍ້ອນກັບ ແລະ ຄວາມຖືກຕ້ອງດິຈິຕອນລະດັບຊາດ
            </h1>
            <div style={{ fontSize: '12px', color: '#d3e2d6', marginTop: '4px' }}>
              ອອກໂດຍ ກະຊວງກະສິກຳ ແລະ ປ່າໄມ້ (MAF) ຮ່ວມກັບ ກົມພາສີ · LAB Chain PoA Consensus (ID: 5222)
            </div>
          </div>
        </div>

        {/* Quick action button for customs officer */}
        <button
          type="button"
          onClick={() => navigate('/customs/release')}
          style={{
            padding: '11px 22px',
            background: '#e2ead8',
            color: '#153826',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <TrainTrack size={16} />
          <span>ອະນຸມັດຜ່ານດ່ານຊ່ອງຂຽວ (15 ນາທີ)</span>
        </button>
      </div>

      {/* 2. Official Certificate Serial & Cryptographic Seal Bar */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #d5dfce',
        borderRadius: '8px',
        padding: '12px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '12px',
        boxShadow: '0 1px 4px rgba(21, 56, 38, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#4d6052', fontWeight: 700 }}>ເລກທີທະບຽນໃບຢັ້ງຢືນ (Cert ID):</span>
          <span style={{ fontWeight: 900, color: '#153826', fontSize: '13px', letterSpacing: '0.3px' }}>
            LA-SSOT-2026-00492
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#4d6052' }}>ລະຫັດທຣານແຊກຊັນ Blockchain:</span>
          <a
            href={`https://explorer.labchain.la/tx/${batch.labchainTxHash}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#153826', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, background: '#e8f2e2', padding: '2px 8px', borderRadius: '4px' }}
          >
            <span>{batch.labchainTxHash.substring(0, 20)}...</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#4d6052' }}>IPFS CID Proof:</span>
          <a
            href={`https://ipfs.io/ipfs/${batch.ipfsCid}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#92400e', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, background: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}
          >
            <span>{batch.ipfsCid.substring(0, 20)}...</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* 3. 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '18px' }}>
        
        {/* Left Column: Product Info & GIS Satellite Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Batch Metadata Card */}
          <div style={{ background: '#ffffff', border: '1.5px solid #d5dfce', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#4d6052', fontWeight: 800, textTransform: 'uppercase' }}>ລະຫັດລັອດສິນຄ້າ (BATCH ID)</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#153826', letterSpacing: '0.5px' }}>
                  {batch.batchId}
                </div>
              </div>
              <span style={{
                background: '#e8f2e2',
                color: '#153826',
                border: '1px solid #c2cfba',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: 800
              }}>
                {batch.traceModel} Model (ISO 22005)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#4d6052', display: 'block', fontSize: '11px', fontWeight: 700 }}>ປະເພດສິນຄ້າ:</span>
                <strong style={{ color: '#142a1d' }}>{batch.productType.replace('_', ' ')}</strong>
              </div>
              <div>
                <span style={{ color: '#4d6052', display: 'block', fontSize: '11px', fontWeight: 700 }}>ນ້ຳໜັກສຸດທິ:</span>
                <strong style={{ color: '#153826', fontSize: '15px' }}>{batch.quantityKg.toLocaleString()} kg</strong>
              </div>
              <div>
                <span style={{ color: '#4d6052', display: 'block', fontSize: '11px', fontWeight: 700 }}>ຊາວກະສິກອນ / ຜູ້ຜະລິດ:</span>
                <span style={{ color: '#142a1d', fontWeight: 700 }}>{batch.farmer.name} (KYC ຢັ້ງຢືນ)</span>
              </div>
              <div>
                <span style={{ color: '#4d6052', display: 'block', fontSize: '11px', fontWeight: 700 }}>ສະຖານທີ່ຕັ້ງແປງປູກ:</span>
                <span style={{ color: '#142a1d' }}>{batch.farmer.district}, ແຂວງ {batch.farmer.province}</span>
              </div>
            </div>
          </div>

          {/* 2. GIS Satellite Map & EUDR Section */}
          <div style={{ background: '#ffffff', border: '1.5px solid #d5dfce', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="#153826" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#142a1d', margin: 0 }}>
                  ແຜນທີ່ດາວທຽມ ແລະ ໃບຮັບຮອງ EUDR
                </h3>
              </div>
              <span style={{
                background: '#dcfce7',
                color: '#15803d',
                border: '1px solid #86efac',
                padding: '3px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 900
              }}>
                🛡️ ປອດການບຸກລຸກປ່າໄມ້ (Reg EU 2023/1115)
              </span>
            </div>

            {/* Satellite Map with Farm Polygon */}
            <LeafletSatelliteMap geoJson={batch.geoJson} height="300px" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '14px', fontSize: '11.5px', color: '#4d6052' }}>
              <div style={{ background: '#edf4e8', border: '1px solid #d5dfce', padding: '9px 10px', borderRadius: '6px' }}>
                <span style={{ fontWeight: 700 }}>ວັນຕັດຍອດ EUDR:</span>
                <strong style={{ display: 'block', color: '#142a1d', marginTop: '2px' }}>{batch.eudrStatus.cutoffDate}</strong>
              </div>
              <div style={{ background: '#edf4e8', border: '1px solid #d5dfce', padding: '9px 10px', borderRadius: '6px' }}>
                <span style={{ fontWeight: 700 }}>ດັດຊະນີພືດພັນ (NDVI):</span>
                <strong style={{ display: 'block', color: '#153826', marginTop: '2px' }}>{batch.eudrStatus.ndviScore.toFixed(2)} / 1.0 (ປົກກະຕິ)</strong>
              </div>
              <div style={{ background: '#edf4e8', border: '1px solid #d5dfce', padding: '9px 10px', borderRadius: '6px' }}>
                <span style={{ fontWeight: 700 }}>ເຊັນເຊີດາວທຽມ:</span>
                <strong style={{ display: 'block', color: '#142a1d', marginTop: '2px' }}>{batch.eudrStatus.satelliteProvider}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Customs Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Chinese Customs Clearance Card (e-Phyto) */}
          {batch.phytoDoc && (
            <div style={{
              background: '#fffdf5',
              border: '1.5px solid #fde68a',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe2 size={18} color="#b45309" />
                  <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#92400e', margin: 0 }}>
                    🇨🇳 ອົງການພາສີໃຫຍ່ແຫ່ງ ສປ ຈີນ (GACC) Pre-Clearance
                  </h3>
                </div>
                <span style={{ background: '#b45309', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 800 }}>
                  ດ່ານໂມ່ຮານ (磨憨口岸)
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12.5px' }}>
                <div style={{ gridColumn: 'span 2', background: '#ffffff', border: '1px solid #fde68a', padding: '10px 12px', borderRadius: '6px' }}>
                  <span style={{ color: '#4d6052', fontSize: '10.5px', display: 'block', fontWeight: 700 }}>品名 (ຊື່ສິນຄ້າພາສາຈີນ GACC):</span>
                  <strong style={{ color: '#b45309', fontSize: '14px' }}>{batch.phytoDoc.productNameZH}</strong>
                  <div style={{ fontSize: '11px', color: '#4d6052', marginTop: '2px' }}>{batch.phytoDoc.productNameEN}</div>
                </div>

                <div>
                  <span style={{ color: '#4d6052', fontSize: '11px', display: 'block', fontWeight: 700 }}>GACC ລະຫັດສວນ/ວິສາຫະກິດ:</span>
                  <strong style={{ color: '#142a1d' }}>{batch.phytoDoc.orchardCode}</strong>
                </div>

                <div>
                  <span style={{ color: '#4d6052', fontSize: '11px', display: 'block', fontWeight: 700 }}>ເລກທີໃບຢັ້ງຢືນສຸຂານາໄມພືດ:</span>
                  <strong style={{ color: '#142a1d' }}>{batch.phytoDoc.certificateNo}</strong>
                </div>

                <div>
                  <span style={{ color: '#4d6052', fontSize: '11px', display: 'block', fontWeight: 700 }}>ໝາຍເລກຊີລສຸລະກາກອນ (Customs Seal):</span>
                  <strong style={{ color: '#153826' }}>{batch.phytoDoc.customsSealNo}</strong>
                </div>

                <div>
                  <span style={{ color: '#4d6052', fontSize: '11px', display: 'block', fontWeight: 700 }}>ວັນໝົດອາຍຸໃບຢັ້ງຢືນ:</span>
                  <strong style={{ color: '#142a1d' }}>{batch.phytoDoc.expiryDate}</strong>
                </div>
              </div>
            </div>
          )}

          {/* 3. Timeline Logs Section (Immutable Audit Trail) */}
          <div style={{ background: '#ffffff', border: '1.5px solid #d5dfce', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={17} color="#153826" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#142a1d', margin: 0 }}>
                  ເສັ້ນທາງການເດີນທາງຂອງສິນຄ້າ (Immutable Audit Trail)
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: '#153826', fontWeight: 800 }}>
                ● ບັນທຶກບົນ LAB Chain
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', paddingLeft: '6px' }}>
              {batch.timelineLogs.map((log, index) => (
                <div key={log.id} style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                  {index < batch.timelineLogs.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '10px',
                      top: '22px',
                      bottom: '-14px',
                      width: '2px',
                      background: '#d5dfce'
                    }} />
                  )}

                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: log.status === 'SUCCESS' ? '#153826' : '#b45309',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    zIndex: 1,
                    flexShrink: 0
                  }}>
                    <CheckCircle2 size={13} />
                  </div>

                  <div style={{ flex: 1, background: '#edf4e8', padding: '10px 14px', borderRadius: '6px', border: '1px solid #d5dfce' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#142a1d' }}>{log.title}</span>
                      <span style={{ fontSize: '10.5px', color: '#4d6052' }}>{log.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#4d6052', margin: '0 0 4px 0', lineHeight: 1.5 }}>
                      {log.description}
                    </p>
                    <div style={{ fontSize: '11px', color: '#153826', fontWeight: 700 }}>
                      ຜູ້ດຳເນີນການ: {log.actor}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
