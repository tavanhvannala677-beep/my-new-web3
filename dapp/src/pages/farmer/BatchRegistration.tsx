import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Satellite, CheckCircle2, Check } from 'lucide-react';
import { saveNewBatch, simulateAI_EUDRCheck } from '../../services/mockData';
import { BatchItem, ProductType } from '../../types/traceability';
import { useSeniorMode } from '../../context/SeniorModeContext';

export const BatchRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { isSeniorMode } = useSeniorMode();

  const [productType, setProductType] = useState<ProductType>('Arabica_Cherry');
  const [quantityKg, setQuantityKg] = useState<number>(15400);
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // AI Satellite Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Available product choices with big visual icons
  const cropChoices: { id: ProductType; name: string; laoDesc: string; icon: string }[] = [
    { id: 'Arabica_Cherry', name: 'ກາເຟອາຣາບິກາ', laoDesc: 'Arabica Cherry (ເມັດແດງ)', icon: '☕' },
    { id: 'Robusta_Cherry', name: 'ກາເຟໂຣບັສຕາ', laoDesc: 'Robusta Cherry (ເມັດສົດ)', icon: '🌱' },
    { id: 'Cassava_Root', name: 'ຫົວມັນຕົ້ນສົດ', laoDesc: 'Fresh Cassava (ມັນຕົ້ນ)', icon: '🥔' },
  ];

  const handleSelectCrop = (id: ProductType) => {
    setProductType(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setLoadingStep(1);
    setTimeout(() => setLoadingStep(2), 1000);
    setTimeout(() => setLoadingStep(3), 2000);

    const newBatchId = 'LA-COF-' + Math.floor(1000 + Math.random() * 9000);
    const mockPolygon = {
      type: 'FeatureCollection' as const,
      features: [{
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [
            [
              [102.1342, 19.8921],
              [102.1388, 19.8935],
              [102.1402, 19.8895],
              [102.1351, 19.8878],
              [102.1342, 19.8921]
            ]
          ]
        },
        properties: {
          farmName: 'Luang Prabang Arabica Plot A',
          areaHectares: 4.85
        }
      }]
    };

    const eudrResult = await simulateAI_EUDRCheck(mockPolygon);

    const newBatch: BatchItem = {
      batchId: newBatchId,
      traceModel: 'IdentityPreserved',
      productType,
      quantityKg,
      harvestDate,
      farmer: {
        name: 'ສົມສັກ ພອນສະຫວັນ',
        phone: '+856 20 5543 2190',
        village: 'ບ້ານລ້ອງລາວໃໝ່',
        district: 'ເມືອງຫຼວງພະບາງ',
        province: 'ແຂວງຫຼວງພະບາງ'
      },
      geoJson: mockPolygon,
      eudrStatus: {
        isPassed: eudrResult.isPassed,
        cutoffDate: '2020-12-31',
        ndviScore: eudrResult.ndviScore,
        satelliteProvider: 'Sentinel-2 ESA',
        verifiedAt: new Date().toISOString()
      },
      timelineLogs: [
        {
          id: 'log-' + Date.now(),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          stage: 'HARVEST',
          title: 'Batch Registered via Senior Farmer App',
          description: `ລົງທະບຽນສິນຄ້າ ${quantityKg.toLocaleString()} ກກ. ພ້ອມພິກັດແປງປູກ GeoJSON`,
          actor: 'ສົມສັກ ພອນສະຫວັນ',
          status: 'SUCCESS'
        },
        {
          id: 'log-eudr-' + Date.now(),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          stage: 'EUDR_AI',
          title: 'AI Satellite EUDR Check Passed',
          description: `Sentinel-2 NDVI Score: ${eudrResult.ndviScore.toFixed(2)} (Deforestation-Free since 2020)`,
          actor: 'Autonomous Sentinel-2 AI Engine',
          status: 'SUCCESS',
          ipfsCid: eudrResult.reportCid
        }
      ],
      status: 'EUDR_Verified',
      labchainTxHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      ipfsCid: eudrResult.reportCid,
      createdAt: new Date().toISOString()
    };

    saveNewBatch(newBatch);
    setIsLoading(false);
    navigate('/farmer/history');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isSeniorMode ? '16px' : '14px' }}>

      {/* Official Form Header */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #d5dfce',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: isSeniorMode ? '13px' : '11.5px'
      }}>
        <div>
          <div style={{ fontWeight: 800, color: '#153826' }}>
            ໃບແຈ້ງຂຶ້ນທະບຽນລັອດສິນຄ້າກະສິກຳແຫ່ງຊາດ
          </div>
          <div style={{ fontSize: '11px', color: '#55685a' }}>
            ມາດຕະຖານ EUDR Reg 2023/1115 & ດຳລັດເລກທີ 328/ລບ
          </div>
        </div>
        <span style={{
          background: '#e8f2e2',
          color: '#153826',
          border: '1px solid #c2cfba',
          borderRadius: '4px',
          padding: '3px 8px',
          fontSize: '10.5px',
          fontWeight: 800
        }}>
          FORM: MAF-AGR-01
        </span>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: isSeniorMode ? '20px' : '14px' }}>
        
        {/* STEP 1: Select Crop Type with Big Visual Cards */}
        <div style={{
          background: '#ffffff',
          borderRadius: '8px',
          border: '1.5px solid #d5dfce',
          padding: isSeniorMode ? '18px 16px' : '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: '#153826',
              color: '#ffffff',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 900
            }}>1</span>
            <label style={{ fontSize: isSeniorMode ? '17px' : '14px', fontWeight: 900, color: '#153826' }}>
              ເລືອກຜົນຜະລິດຂອງທ່ານ
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {cropChoices.map((crop) => {
              const isSelected = productType === crop.id;
              return (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => handleSelectCrop(crop.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: isSeniorMode ? '16px 18px' : '12px 14px',
                    background: isSelected ? '#e8f2e1' : '#ffffff',
                    border: isSelected ? '2.5px solid #153826' : '1.5px solid #d5dfce',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    boxShadow: isSelected ? '0 4px 14px rgba(21, 56, 38, 0.12)' : 'none'
                  }}
                >
                  <span style={{ fontSize: isSeniorMode ? '34px' : '28px' }}>{crop.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: isSeniorMode ? '18px' : '15px', fontWeight: 900, color: '#153826' }}>
                      {crop.name}
                    </div>
                    <div style={{ fontSize: isSeniorMode ? '13px' : '11px', color: '#55685a' }}>
                      {crop.laoDesc}
                    </div>
                  </div>
                  {isSelected && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#153826',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={18} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Quantity */}
        <div style={{
          background: '#ffffff',
          borderRadius: '8px',
          border: '1.5px solid #d5dfce',
          padding: isSeniorMode ? '18px 16px' : '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: '#153826',
              color: '#ffffff',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 900
            }}>2</span>
            <label style={{ fontSize: isSeniorMode ? '17px' : '14px', fontWeight: 900, color: '#153826' }}>
              ບອກນ້ຳໜັກສິນຄ້າ (ກິໂລກຣາມ)
            </label>
          </div>

          {/* Direct Input Field for Weight */}
          <div style={{ position: 'relative', marginTop: '4px' }}>
            <input
              type="number"
              min={1}
              value={quantityKg || ''}
              onChange={(e) => setQuantityKg(Number(e.target.value))}
              placeholder="ປ້ອນຕົວເລກນ້ຳໜັກ..."
              style={{
                width: '100%',
                padding: isSeniorMode ? '16px 90px 16px 18px' : '12px 76px 12px 14px',
                background: '#ffffff',
                border: '2px solid #153826',
                borderRadius: '8px',
                color: '#153826',
                fontSize: isSeniorMode ? '24px' : '18px',
                fontWeight: 900,
                outline: 'none',
                boxSizing: 'border-box'
              }}
              required
            />
            <span style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: isSeniorMode ? '16px' : '13px',
              fontWeight: 800,
              color: '#4d6052',
              pointerEvents: 'none'
            }}>
              ກິໂລກຣາມ
            </span>
          </div>
        </div>

        {/* STEP 3: Harvest Date */}
        <div style={{
          background: '#ffffff',
          borderRadius: '8px',
          border: '1.5px solid #d5dfce',
          padding: isSeniorMode ? '16px' : '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: isSeniorMode ? '15px' : '13px', fontWeight: 800, color: '#153826' }}>
              ວັນທີເກັບກ່ຽວ:
            </div>
            <div style={{ fontSize: isSeniorMode ? '13px' : '11px', color: '#55685a' }}>
              ເລືອກມື້ນີ້ ຫຼື ມື້ວານນີ້
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setHarvestDate(new Date().toISOString().split('T')[0]);
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                background: '#153826',
                color: '#ffffff',
                border: 'none',
                fontSize: isSeniorMode ? '14px' : '12px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              ມື້ນີ້ (Today)
            </button>
            <input
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #c2cfba',
                fontSize: '13px',
                color: '#153826',
                fontWeight: 700
              }}
            />
          </div>
        </div>

        {/* AI Loading Modal / Overlay (Organic Sage Theme) */}
        {isLoading && (
          <div style={{
            background: '#e1e9d8',
            border: '2px solid #153826',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 8px 24px rgba(21, 56, 38, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#153826', fontWeight: 900, fontSize: isSeniorMode ? '16px' : '14px' }}>
              <Satellite className="animate-spin" size={24} />
              <span>AI ກຳລັງກວດສອບພາບຖ່າຍດາວທຽມ EUDR...</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: isSeniorMode ? '14px' : '12px', color: '#334839' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: loadingStep >= 1 ? '#153826' : '#708375', fontWeight: loadingStep >= 1 ? 800 : 500 }}>
                <CheckCircle2 size={18} />
                <span>1. ເຊື່ອມຕໍ່ດາວທຽມ Sentinel-2 (ESA)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: loadingStep >= 2 ? '#153826' : '#708375', fontWeight: loadingStep >= 2 ? 800 : 500 }}>
                <CheckCircle2 size={18} />
                <span>2. ຄຳນວນຄ່າດັດຊະນີພືດພັນ (NDVI Analysis)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: loadingStep >= 3 ? '#153826' : '#708375', fontWeight: loadingStep >= 3 ? 800 : 500 }}>
                <CheckCircle2 size={18} />
                <span>3. ຢືນຢັນບໍ່ມີການບຸກລຸກປ່າໄມ້ຫຼັງ 31 ທ.ວ. 2020</span>
              </div>
            </div>
          </div>
        )}

        {/* Super Sized Submit Button for Senior Thumb Touch */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: '8px',
            padding: isSeniorMode ? '18px 20px' : '14px 18px',
            background: isLoading ? '#8a9c8f' : '#153826',
            color: '#f4f7f0',
            border: 'none',
            borderRadius: '8px',
            fontSize: isSeniorMode ? '18px' : '15px',
            fontWeight: 900,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(21, 56, 38, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          {isLoading ? (
            <span>ກຳລັງກວດສອບດາວທຽມ Sentinel-2...</span>
          ) : (
            <>
              <span>🛡️ ຢືນຢັນ & ອອກໃບຮັບຮອງດາວທຽມ EUDR</span>
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
          ✓ ໃບຮັບຮອງດິຈິຕອນຈະຖືກບັນທຶກບົນ LAB Chain (PoA Mainnet 5222) ໂດຍອັດຕະໂນມັດ ຖືກຕ້ອງຕາມດຳລັດເລກທີ 328/ລບ
        </div>
      </form>
    </div>
  );
};
