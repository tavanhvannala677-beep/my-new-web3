import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Sparkles, Globe2, ArrowRight } from 'lucide-react';
import { simulateAI_PhytoOCR } from '../../services/mockData';
import { ExtractedPhytoDoc } from '../../types/traceability';

export const ExportClearanceOCR: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedPhytoDoc | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const uploaded = e.target.files[0];
    setFile(uploaded);
    setIsProcessing(true);
    setIsConfirmed(false);

    const data = await simulateAI_PhytoOCR(uploaded);
    setExtractedData(data);
    setIsProcessing(false);
  };

  const handleConfirmClearance = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmed(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
          ຍື່ນເອກະສານດ່ານ & AI OCR (e-Phyto)
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          ອັບໂຫຼດໃບຢັ້ງຢືນສຸຂານາໄມພືດ (e-Phyto) ພາສາລາວ ໃຫ້ AI ສະກັດຂໍ້ມູນ ແລະ ແປເປັນພາສາຈີນ (中文) ລ່ວງໜ້າສຳລັບດ່ານໂມ່ຮານ (GACC)
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div style={{
        background: '#ffffff',
        border: '2px dashed #cbd5e1',
        borderRadius: '8px',
        padding: '32px 20px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%'
          }}
        />

        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '8px',
          background: '#e0f2fe',
          color: '#0284c7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 10px auto'
        }}>
          <UploadCloud size={26} />
        </div>

        <h3 style={{ fontSize: '14.5px', color: '#0f172a', margin: '0 0 4px 0', fontWeight: 700 }}>
          {file ? file.name : 'ລາກໄຟລ໌ໃບຢັ້ງຢືນ e-Phyto ມາວາງ ຫຼື ຄລິກເພື່ອເລືອກໄຟລ໌'}
        </h3>
        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
          ຮອງຮັບໄຟລ໌ PDF, JPG, PNG (ໃບຢັ້ງຢືນສຸຂານາໄມພືດ ຈາກກະຊວງກະສິກຳ ແລະ ປ່າໄມ້)
        </p>
      </div>

      {/* AI Processing Status Indicator */}
      {isProcessing && (
        <div style={{
          background: '#e1e9d8',
          border: '1px solid #ccd8be',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <Sparkles className="animate-spin" size={28} color="#153826" style={{ margin: '0 auto 10px auto' }} />
          <h3 style={{ fontSize: '15.5px', color: '#153826', margin: '0 0 6px 0', fontWeight: 800 }}>
            AI ກຳລັງສະແກນເອກະສານ ແລະ ແປເປັນພາສາຈີນ...
          </h3>
          <p style={{ fontSize: '12.5px', color: '#4d6052', margin: 0 }}>
            ກຳລັງແປງລະຫັດສວນ (GACC Orchard Code), ດຶງຄ່ານ້ຳໜັກ, ແລະ ກວດສອບຄວາມຖືກຕ້ອງຂອງກາປະທັບ
          </p>
        </div>
      )}

      {/* Extracted Form (Human-in-the-loop review) */}
      {extractedData && !isProcessing && (
        <form onSubmit={handleConfirmClearance} style={{
          background: '#ffffff',
          border: '1px solid #d5dfce',
          borderRadius: '12px',
          padding: '26px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          boxShadow: '0 2px 8px rgba(21, 56, 38, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe2 size={18} color="#153826" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#142a1d', margin: 0 }}>
                ຜົນການສະກັດ ແລະ ແປພາສາໂດຍ AI (ກະລຸນາກວດສອບກ່ອນຢືນຢັນ)
              </h3>
            </div>
            <span style={{
              background: '#e1e9d8',
              color: '#153826',
              border: '1px solid #ccd8be',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 800
            }}>
              AI Confidence: 99.4%
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                ເລກທີໃບຢັ້ງຢືນ (Certificate No.)
              </label>
              <input
                type="text"
                value={extractedData.certificateNo}
                onChange={(e) => setExtractedData({ ...extractedData, certificateNo: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                ລະຫັດສວນ/ໂຮງງານມາດຕະຖານຈີນ (GACC Orchard Code)
              </label>
              <input
                type="text"
                value={extractedData.orchardCode}
                onChange={(e) => setExtractedData({ ...extractedData, orchardCode: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #0284c7', borderRadius: '6px', color: '#0284c7', fontWeight: 700, fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                ຊື່ສິນຄ້າພາສາຈີນ (品名 - Translated for GACC)
              </label>
              <input
                type="text"
                value={extractedData.productNameZH}
                onChange={(e) => setExtractedData({ ...extractedData, productNameZH: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #059669', borderRadius: '6px', color: '#047857', fontWeight: 700, fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                ຊື່ສິນຄ້າພາສາອັງກິດ (Product Name EN)
              </label>
              <input
                type="text"
                value={extractedData.productNameEN}
                onChange={(e) => setExtractedData({ ...extractedData, productNameEN: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                ນ້ຳໜັກທີ່ລະບຸໃນໃບຢັ້ງຢືນ (kg)
              </label>
              <input
                type="number"
                value={extractedData.weightKg}
                onChange={(e) => setExtractedData({ ...extractedData, weightKg: Number(e.target.value) })}
                style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                ວັນໝົດອາຍຸໃບຢັ້ງຢືນ (Expiry Date)
              </label>
              <input
                type="date"
                value={extractedData.expiryDate}
                onChange={(e) => setExtractedData({ ...extractedData, expiryDate: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', fontSize: '13px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="submit"
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
              <span>ຢືນຢັນ ແລະ ສົ່ງຂໍ້ມູນລ່ວງໜ້າໄປດ່ານໂມ່ຮານ (Pre-Arrival Clear)</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      )}

      {isConfirmed && (
        <div style={{
          background: '#e1e9d8',
          border: '1px solid #ccd8be',
          borderRadius: '12px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 2px 8px rgba(21, 56, 38, 0.05)'
        }}>
          <CheckCircle2 size={32} color="#153826" />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#153826' }}>
              ຂໍ້ມູນ e-Phyto ແລະ ຜົນແປພາສາຈີນຖືກປະທັບຕາບົນ Labchain ຮຽບຮ້ອຍແລ້ວ!
            </div>
            <div style={{ fontSize: '12.5px', color: '#4d6052', marginTop: '3px' }}>
              ສົ່ງຂໍ້ມູນຕໍ່ໄປຍັງລະບົບ NSWA+ (ສຸລະກາກອນລາວ) ແລະ ລະບົບ GACC (ສຸລະກາກອນຈີນ) ລໍຖ້າການສະແກນຜ່ານຊ່ອງຂຽວ
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
