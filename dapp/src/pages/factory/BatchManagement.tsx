import React, { useState } from 'react';
import { getStoredBatches, saveNewBatch } from '../../services/mockData';
import { BatchItem, ProductType } from '../../types/traceability';
import { Layers, AlertTriangle, X } from 'lucide-react';

export const BatchManagement: React.FC = () => {
  const [batches, setBatches] = useState<BatchItem[]>(getStoredBatches());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showMergeModal, setShowMergeModal] = useState(false);

  // Merge Form state
  const [newProductType, setNewProductType] = useState<ProductType>('Cassava_Starch');
  const [newQuantityKg, setNewQuantityKg] = useState<number>(28000);
  const [isMerging, setIsMerging] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedBatches = batches.filter(b => selectedIds.includes(b.batchId));
  const totalInputWeight = selectedBatches.reduce((acc, b) => acc + b.quantityKg, 0);

  const handleMergeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMerging(true);

    await new Promise(r => setTimeout(r, 1800));

    const newBatchId = 'LA-MERGED-' + Math.floor(1000 + Math.random() * 9000);
    const newMergedBatch: BatchItem = {
      batchId: newBatchId,
      traceModel: 'MassBalance',
      productType: newProductType,
      quantityKg: newQuantityKg,
      harvestDate: new Date().toISOString(),
      farmer: {
        name: `ຮວມຜົນຜະລິດຈາກ ${selectedBatches.length} ຟາມ (Mass Balance Aggregation)`,
        phone: '+856 20 8899 0011',
        village: 'ໂຮງງານແປຮູບຫຼັກ',
        district: 'ເມືອງອຸທຸມພອນ',
        province: 'ແຂວງສະຫວັນນະເຂດ'
      },
      geoJson: selectedBatches[0]?.geoJson || {
        type: 'FeatureCollection',
        features: []
      },
      eudrStatus: {
        isPassed: true,
        cutoffDate: '2020-12-31',
        ndviScore: 0.81,
        satelliteProvider: 'Sentinel-2 ESA',
        verifiedAt: new Date().toISOString()
      },
      parentBatchIds: selectedIds,
      timelineLogs: [
        {
          id: 'log-merge-' + Date.now(),
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          stage: 'PROCESSING',
          title: `Mass Balance Merge (${selectedBatches.length} Batches)`,
          description: `ຮວມຜົນຜະລິດວັດຖຸດິບ ${totalInputWeight.toLocaleString()} ກກ. ແປຮູບເປັນ ${newProductType.replace('_', ' ')} ${newQuantityKg.toLocaleString()} ກກ.`,
          actor: 'Factory Operator #4',
          txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          status: 'SUCCESS'
        }
      ],
      status: 'Processed',
      labchainTxHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      ipfsCid: 'bafybeimerged' + Math.random().toString(36).substring(2, 8),
      createdAt: new Date().toISOString()
    };

    saveNewBatch(newMergedBatch);
    setBatches(getStoredBatches());
    setIsMerging(false);
    setShowMergeModal(false);
    setSelectedIds([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
            ຈັດການລັອດສິນຄ້າ & ຮວມລັອດ (Mass Balance)
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            ເລືອກຫຼາຍລັອດເພື່ອເຮັດ Mass Balance ຮວມເປັນລັອດໃຫຍ່ (Container Batch) ບັນທຶກລົງ Smart Contract
          </p>
        </div>

        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setNewQuantityKg(Math.round(totalInputWeight * 0.35));
              setShowMergeModal(true);
            }}
            style={{
              padding: '10px 20px',
              background: '#153826',
              color: '#f4f7f0',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(21, 56, 38, 0.25)'
            }}
          >
            <Layers size={16} />
            <span>ຮວມລັອດທີ່ເລືອກ ({selectedIds.length} ລັອດ — {totalInputWeight.toLocaleString()} kg)</span>
          </button>
        )}
      </div>

      {/* Batches Data Table */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #d5dfce',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(21, 56, 38, 0.04)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#e1e9d8', borderBottom: '1px solid #ccd8be', color: '#153826', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px', width: '40px' }}>ເລືອກ</th>
              <th style={{ padding: '12px 16px' }}>ລະຫັດລັອດ (Batch ID)</th>
              <th style={{ padding: '12px 16px' }}>ຮູບແບບ (Model)</th>
              <th style={{ padding: '12px 16px' }}>ສິນຄ້າ</th>
              <th style={{ padding: '12px 16px' }}>ນ້ຳໜັກ (kg)</th>
              <th style={{ padding: '12px 16px' }}>ຟາມ / ຊາວກະສິກອນ</th>
              <th style={{ padding: '12px 16px' }}>ສະຖານະ EUDR</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => {
              const isSelected = selectedIds.includes(b.batchId);
              return (
                <tr
                  key={b.batchId}
                  onClick={() => toggleSelect(b.batchId)}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: isSelected ? '#f0f9ff' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.1s'
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(b.batchId)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0284c7', letterSpacing: '0.3px' }}>
                    {b.batchId}
                    {b.parentBatchIds && b.parentBatchIds.length > 0 && (
                      <span style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 400 }}>
                        (ຮວມຈາກ {b.parentBatchIds.length} ຟາມ)
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>
                    {b.traceModel}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>
                    {b.productType.replace('_', ' ')}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>
                    {b.quantityKg.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '12px' }}>
                    {b.farmer.name}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: '#ecfdf5',
                      color: '#059669',
                      border: '1px solid #a7f3d0',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}>
                      EUDR Passed
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mass Balance Merge Modal */}
      {showMergeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <button
              type="button"
              onClick={() => setShowMergeModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '6px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  ຮວມລັອດສິນຄ້າ (Mass Balance Merge)
                </h3>
                <div style={{ fontSize: '12px', color: '#0284c7' }}>
                  Smart Contract function: splitOrMergeBatch()
                </div>
              </div>
            </div>

            <form onSubmit={handleMergeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>ລັອດຕົ້ນທາງທີ່ເລືອກ ({selectedIds.length} ລັອດ):</div>
                <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 700, letterSpacing: '0.3px' }}>
                  {selectedIds.join(', ')}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginTop: '6px' }}>
                  ນ້ຳໜັກວັດຖຸດິບລວມ (Total Input): <span style={{ color: '#059669' }}>{totalInputWeight.toLocaleString()} kg</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  ສິນຄ້າແປຮູບປາຍທາງ (New Processed Product)
                </label>
                <select
                  value={newProductType}
                  onChange={(e) => setNewProductType(e.target.value as ProductType)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    color: '#0f172a',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                >
                  <option value="Cassava_Starch">ແປ້ງມັນຕົ້ນບໍລິສຸດ (Cassava Starch)</option>
                  <option value="Roasted_Coffee">ເມັດກາເຟຂົ້ວເກຣດສົ່ງອອກ (Roasted Coffee)</option>
                  <option value="Cassava_Chips">ມັນຕົ້ນແຫ້ງຊອຍ (Cassava Chips)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  ນ້ຳໜັກສຸດທິຜົນຜະລິດໃໝ່ (Net Output Weight kg)
                </label>
                <input
                  type="number"
                  min={1}
                  value={newQuantityKg}
                  onChange={(e) => setNewQuantityKg(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    color: '#0f172a',
                    fontSize: '15px',
                    fontWeight: 700,
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  required
                />
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  ອັດຕາຜົນຜະລິດ (Processing Yield): {((newQuantityKg / totalInputWeight) * 100).toFixed(1)}%
                </div>
              </div>

              {newQuantityKg > totalInputWeight && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '10px', display: 'flex', gap: '8px', color: '#b91c1c', fontSize: '11.5px' }}>
                  <AlertTriangle size={15} />
                  <span>ຄຳເຕືອນ Mass Balance: ນ້ຳໜັກຜົນຜະລິດໃໝ່ສູງກວ່ານ້ຳໜັກວັດຖຸດິບຕົ້ນທາງ!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isMerging}
                style={{
                  padding: '11px',
                  background: isMerging ? '#94a3b8' : '#0284c7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: isMerging ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isMerging ? 'ກຳລັງບັນທຶກລົງ Smart Contract...' : 'ຢືນຢັນການຮວມລັອດ (Write to Labchain)'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
