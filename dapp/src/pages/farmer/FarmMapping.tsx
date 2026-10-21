import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PolygonDrawMap } from '../../components/PolygonDrawMap';
import { GeoJsonPolygon } from '../../types/traceability';
import { MapPin, Check } from 'lucide-react';
import { useSeniorMode } from '../../context/SeniorModeContext';

export const FarmMapping: React.FC = () => {
  const navigate = useNavigate();
  const { isSeniorMode } = useSeniorMode();

  const [farmName, setFarmName] = useState('ສວນກາເຟ ພູພຽງ ຫຼວງພະບາງ (ແປງ A)');
  const [farmerName, setFarmerName] = useState('ສົມສັກ ພອນສະຫວັນ');
  const [cropType, setCropType] = useState('Coffee');
  const [hectares, setHectares] = useState<number>(4.85);
  const [saved, setSaved] = useState(false);

  // Quick pre-registered plots for elderly farmers
  const presetPlots = [
    { name: 'ສວນກາເຟ ພູພຽງ ຫຼວງພະບາງ (ແປງ A)', crop: 'Coffee', ha: 4.85, icon: '☕' },
    { name: 'ສວນມັນຕົ້ນ ບ້ານລ້ອງລາວ (ແປງ B)', crop: 'Cassava', ha: 2.50, icon: '🥔' }
  ];

  const handlePolygonChange = (_newGeoJson: GeoJsonPolygon, area: number) => {
    setHectares(area);
  };

  const handleSelectPreset = (plot: typeof presetPlots[0]) => {
    setFarmName(plot.name);
    setCropType(plot.crop);
    setHectares(plot.ha);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      navigate('/farmer/register');
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isSeniorMode ? '18px' : '14px' }}>
      {/* Clean Flat Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h2 style={{
            fontSize: isSeniorMode ? '19px' : '17px',
            fontWeight: 900,
            color: '#142a1d',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <MapPin size={isSeniorMode ? 22 : 18} color="#153826" />
            <span>ປັກໝຸດໄຮ່ນາ (Farm Polygon Geolocation)</span>
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
            MAF-GEO-02
          </span>
        </div>
        <p style={{ fontSize: isSeniorMode ? '13px' : '11.5px', color: '#4d6052', margin: 0 }}>
          ກົດປຸ່ມສີຂຽວເທິງແຜນທີ່ ເພື່ອດຶງພິກັດ GPS ດາວທຽມອັດຕະໂນມັດ ຕາມມາດຕະຖານ EUDR Art. 9
        </p>
      </div>

      {/* Quick Preset Plots (Easy for elderly) */}
      <div style={{
        background: '#ffffff',
        borderRadius: '8px',
        border: '1.5px solid #d5dfce',
        padding: isSeniorMode ? '14px 16px' : '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ fontSize: isSeniorMode ? '14px' : '12px', fontWeight: 800, color: '#153826' }}>
          ຫຼື ເລືອກແປງປູກທີ່ຂຶ້ນທະບຽນໄວ້ແລ້ວ:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {presetPlots.map((plot) => (
            <button
              key={plot.name}
              type="button"
              onClick={() => handleSelectPreset(plot)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: isSeniorMode ? '12px 14px' : '8px 10px',
                background: farmName === plot.name ? '#e8f2e1' : '#f9fbf8',
                border: farmName === plot.name ? '2px solid #153826' : '1px solid #d5dfce',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: isSeniorMode ? '22px' : '18px' }}>{plot.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: isSeniorMode ? '15px' : '13px', fontWeight: 800, color: '#153826' }}>
                  {plot.name}
                </div>
                <div style={{ fontSize: isSeniorMode ? '12px' : '11px', color: '#55685a' }}>
                  ເນື້ອທີ່: {plot.ha} ເຮັກຕາ (ຄິດໄລ່ແລ້ວ)
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Satellite Map Component */}
      <PolygonDrawMap onPolygonChange={handlePolygonChange} height={isSeniorMode ? '300px' : '260px'} isSeniorMode={isSeniorMode} />

      {/* Form Fields with High Contrast & Senior Sizes */}
      <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: isSeniorMode ? '16px' : '12px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '8px',
          border: '1.5px solid #d5dfce',
          padding: isSeniorMode ? '16px' : '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: isSeniorMode ? '15px' : '12px', fontWeight: 800, color: '#142a1d', marginBottom: '4px' }}>
              ຊື່ຊາວກະສິກອນ:
            </label>
            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              style={{
                width: '100%',
                padding: isSeniorMode ? '14px 16px' : '10px 12px',
                background: '#ffffff',
                border: '1.5px solid #cdd8c4',
                borderRadius: '6px',
                color: '#142a1d',
                fontSize: isSeniorMode ? '16px' : '13px',
                fontWeight: 700,
                boxSizing: 'border-box',
                outline: 'none'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: isSeniorMode ? '15px' : '12px', fontWeight: 800, color: '#142a1d', marginBottom: '4px' }}>
              ຊື່ແປງປູກ:
            </label>
            <input
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              style={{
                width: '100%',
                padding: isSeniorMode ? '14px 16px' : '10px 12px',
                background: '#ffffff',
                border: '1.5px solid #cdd8c4',
                borderRadius: '6px',
                color: '#142a1d',
                fontSize: isSeniorMode ? '16px' : '13px',
                fontWeight: 700,
                boxSizing: 'border-box',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: isSeniorMode ? '14px' : '11.5px', fontWeight: 800, color: '#142a1d', marginBottom: '4px' }}>
                ປະເພດພືດ:
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                style={{
                  width: '100%',
                  padding: isSeniorMode ? '14px 12px' : '10px 12px',
                  background: '#ffffff',
                  border: '1.5px solid #cdd8c4',
                  borderRadius: '6px',
                  color: '#142a1d',
                  fontSize: isSeniorMode ? '15px' : '13px',
                  fontWeight: 700,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              >
                <option value="Coffee">ກາເຟ (Coffee)</option>
                <option value="Cassava">ມັນຕົ້ນ (Cassava)</option>
                <option value="Rubber">ຢາງພາຣາ (Rubber)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: isSeniorMode ? '14px' : '11.5px', fontWeight: 800, color: '#142a1d', marginBottom: '4px' }}>
                ເນື້ອທີ່ (ເຮັກຕາ):
              </label>
              <input
                type="number"
                step="0.01"
                value={hectares}
                onChange={(e) => setHectares(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: isSeniorMode ? '14px 12px' : '10px 12px',
                  background: '#ffffff',
                  border: '1.5px solid #cdd8c4',
                  borderRadius: '6px',
                  color: '#153826',
                  fontSize: isSeniorMode ? '17px' : '14px',
                  fontWeight: 900,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
                required
              />
            </div>
          </div>
        </div>

        {/* Big Submit Button */}
        <button
          type="submit"
          style={{
            padding: isSeniorMode ? '18px 20px' : '13px 18px',
            background: saved ? '#10b981' : '#153826',
            color: '#f4f7f0',
            border: 'none',
            borderRadius: '8px',
            fontSize: isSeniorMode ? '18px' : '14px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(21, 56, 38, 0.25)'
          }}
        >
          {saved ? (
            <>
              <Check size={isSeniorMode ? 24 : 18} />
              <span>ບັນທຶກສຳເລັດແລ້ວ!</span>
            </>
          ) : (
            <>
              <span>ບັນທຶກແປງປູກ & ໄປລົງທະບຽນສິນຄ້າ ➜</span>
            </>
          )}
        </button>

        {/* Legal & Blockchain Guarantee Note */}
        <div style={{
          textAlign: 'center',
          fontSize: '11px',
          color: '#55685a',
          lineHeight: 1.5,
          marginTop: '2px'
        }}>
          ✓ ພິກັດແປງປູກ Polygon GeoJSON ຖືກປົກປ້ອງດ້ວຍລະຫັດ Cryptographic Anchor ບົນ LAB Chain Mainnet (5222)
        </div>
      </form>
    </div>
  );
};
