import { BatchItem, ExtractedPhytoDoc, GeoJsonPolygon, TimelineLogItem } from '../types/traceability';

// Initial Seed Batches
const INITIAL_BATCHES: BatchItem[] = [
  {
    batchId: 'LA-COF-2026-001',
    traceModel: 'IdentityPreserved',
    productType: 'Arabica_Cherry',
    quantityKg: 15400,
    harvestDate: '2026-10-18T07:30:00Z',
    farmer: {
      name: 'ສົມສັກ ພອນສະຫວັນ (Somsack Phonsavanh)',
      phone: '+856 20 5543 2190',
      village: 'Ban Long Lao Mai (ບ້ານລ້ອງລາວໃໝ່)',
      district: 'Luang Prabang District (ເມືອງຫຼວງພະບາງ)',
      province: 'Luang Prabang Province (ແຂວງຫຼວງພະບາງ)'
    },
    geoJson: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            // Coordinates around Luang Prabang Arabica farm
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
            farmName: 'Luang Prabang Highland Coffee Plot A',
            areaHectares: 4.85,
            farmerName: 'Somsack Phonsavanh',
            cropType: 'Coffee'
          }
        }
      ]
    },
    eudrStatus: {
      isPassed: true,
      cutoffDate: '2020-12-31',
      ndviScore: 0.84,
      satelliteProvider: 'Sentinel-2 ESA',
      verifiedAt: '2026-10-18T08:15:00Z'
    },
    phytoDoc: {
      certificateNo: 'LA-PHYTO-2026-9812',
      issueDate: '2026-10-19',
      expiryDate: '2026-11-19',
      orchardCode: 'GACC-LA-COF-048',
      exporterName: 'Lao Agro-Export State Enterprise',
      productNameLao: 'ໝາກກາເຟອາຣາບິກາຄຸນນະພາບສູງ',
      productNameEN: 'Premium Specialty Arabica Coffee Beans',
      productNameZH: '高品质阿拉比卡特种咖啡豆',
      weightKg: 15400,
      customsSealNo: 'MO-HAN-GREEN-8891',
      isAiVerified: true
    },
    timelineLogs: [
      {
        id: 'log-1',
        timestamp: '2026-10-18 07:30',
        stage: 'HARVEST',
        title: 'Batch Registered by Farmer',
        description: 'ລົງທະບຽນລັອດກາເຟ 15,400 ກກ. ໂດຍ ສົມນຶກ ພອນສະຫວັນ ຜ່ານ Farmer PWA',
        actor: 'Luang Prabang Plot A (Farmer)',
        txHash: '0x3f9e4a8b1c2d0f3e7a6b5c4d3e2f1a0b9c8d7e6f',
        status: 'SUCCESS'
      },
      {
        id: 'log-2',
        timestamp: '2026-10-18 08:15',
        stage: 'EUDR_AI',
        title: 'AI Satellite EUDR Audit Passed',
        description: 'Sentinel-2 NDVI Analysis: ກວດສອບຍ້ອນຫຼັງຮອດ 31 ທ.ວ. 2020 ບໍ່ພົບການຕັດໄມ້ທຳລາຍປ່າ (Deforestation-Free)',
        actor: 'Autonomous Sentinel-2 AI Engine',
        ipfsCid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        status: 'SUCCESS'
      },
      {
        id: 'log-3',
        timestamp: '2026-10-19 14:00',
        stage: 'CUSTOMS_OCR',
        title: 'e-Phyto AI OCR & Chinese Translation Confirmed',
        description: 'ສະແກນໃບຢັ້ງຢືນສຸຂານາໄມພືດ ແປພາສາລາວ -> ຈີນ (GACC Code: GACC-LA-COF-048)',
        actor: 'Lao Ministry of Agriculture / Exporter Portal',
        ipfsCid: 'bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedfdwhqabf3oclgtqy55fbzda',
        status: 'SUCCESS'
      },
      {
        id: 'log-4',
        timestamp: '2026-10-20 16:45',
        stage: 'BORDER_CLEARANCE',
        title: 'Pre-Arrival Clearance Sent to Mohan Customs',
        description: 'ສົ່ງຂໍ້ມູນລ່ວງໜ້າໄປຍັງລະບົບ GACC ດ່ານໂມ່ຫານ ລົດໄຟຂົນສົ່ງສິນຄ້າຂະບວນ LX-802',
        actor: 'NSWA+ Lao Single Window',
        txHash: '0x8b1c2d0f3e7a6b5c4d3e2f1a0b9c8d7e6f3f9e4a',
        status: 'SUCCESS'
      }
    ],
    status: 'InTransit',
    labchainTxHash: '0x7e2b19f4a8c3d0f7a6b5c4e2d1a0b9c8d7e6f3f9e4a8b1c2d0f3e7a6b5c4d3e2',
    ipfsCid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    createdAt: '2026-10-18T07:30:00Z'
  },
  {
    batchId: 'LA-CAS-2026-042',
    traceModel: 'MassBalance',
    productType: 'Cassava_Starch',
    quantityKg: 28000,
    harvestDate: '2026-10-17T09:00:00Z',
    farmer: {
      name: 'ສະຫະກອນກະສິກຳ ສະຫວັນນະເຂດ (Savannakhet Cassava Co-op)',
      phone: '+856 20 9988 7766',
      village: 'Ban Outhoumphone (ບ້ານອຸທຸມພອນ)',
      district: 'Outhoumphone District (ເມືອງອຸທຸມພອນ)',
      province: 'Savannakhet Province (ແຂວງສະຫວັນນະເຂດ)'
    },
    geoJson: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [105.0123, 16.5891],
                [105.0210, 16.5920],
                [105.0250, 16.5840],
                [105.0150, 16.5810],
                [105.0123, 16.5891]
              ]
            ]
          },
          properties: {
            farmName: 'Savannakhet Cassava Aggregation Cluster',
            areaHectares: 18.5,
            cropType: 'Cassava'
          }
        }
      ]
    },
    eudrStatus: {
      isPassed: true,
      cutoffDate: '2020-12-31',
      ndviScore: 0.79,
      satelliteProvider: 'Sentinel-2 ESA',
      verifiedAt: '2026-10-17T11:20:00Z'
    },
    parentBatchIds: ['LA-FARM-01', 'LA-FARM-02', 'LA-FARM-03'],
    timelineLogs: [
      {
        id: 'log-cas-1',
        timestamp: '2026-10-17 09:00',
        stage: 'PROCESSING',
        title: 'Mass Balance Merge Completed',
        description: 'ຮວມມັນຕົ້ນສົດ 3 ຟາມ ຜະລິດເປັນແປ້ງມັນຕົ້ນບໍລິສຸດ 28 ໂຕນ ບັນທຶກລົງ Labchain',
        actor: 'Lao-China Agri-Processing Factory #2',
        txHash: '0x4d3e2f1a0b9c8d7e6f3f9e4a8b1c2d0f3e7a6b5c',
        status: 'SUCCESS'
      }
    ],
    status: 'CustomsCleared',
    labchainTxHash: '0x1c2d0f3e7a6b5c4d3e2f1a0b9c8d7e6f3f9e4a8b1c2d0f3e7a6b5c4d3e2f1a0b',
    ipfsCid: 'bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedfdwhqabf3oclgtqy55fbzda',
    createdAt: '2026-10-17T09:00:00Z'
  }
];

const STORAGE_KEY = 'lao_national_traceability_batches';

export function getStoredBatches(): BatchItem[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BATCHES));
    return INITIAL_BATCHES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_BATCHES;
  }
}

export function getBatchById(batchId: string): BatchItem | undefined {
  const batches = getStoredBatches();
  return batches.find(b => b.batchId.toLowerCase() === batchId.trim().toLowerCase());
}

export function saveNewBatch(newBatch: BatchItem): void {
  const batches = getStoredBatches();
  const updated = [newBatch, ...batches.filter(b => b.batchId !== newBatch.batchId)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Simulated AI EUDR Satellite Engine
export async function simulateAI_EUDRCheck(polygon: GeoJsonPolygon): Promise<{
  isPassed: boolean;
  ndviScore: number;
  reportCid: string;
}> {
  // Simulate 2.5s Sentinel-2 satellite analysis
  await new Promise(r => setTimeout(r, 2500));
  return {
    isPassed: true,
    ndviScore: 0.82 + Math.random() * 0.1,
    reportCid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy' + Math.random().toString(36).substring(2, 8)
  };
}

// Simulated AI e-Phyto OCR Engine
export async function simulateAI_PhytoOCR(file: File): Promise<ExtractedPhytoDoc> {
  // Simulate 3s AI document processing & Lao-to-Chinese translation
  await new Promise(r => setTimeout(r, 2800));
  return {
    certificateNo: 'LA-PHYTO-2026-' + Math.floor(1000 + Math.random() * 9000),
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    orchardCode: 'GACC-LA-COF-' + Math.floor(10 + Math.random() * 90),
    exporterName: 'Lao National Agriculture Trading Corp.',
    productNameLao: 'ກາເຟອາຣາບິກາ ທຳມະຊາດ (Organic Arabica)',
    productNameEN: 'Natural Specialty Arabica Green Coffee',
    productNameZH: '老挝天然特级阿拉比卡生咖啡豆 (EUDR合规)',
    weightKg: 24500,
    customsSealNo: 'GACC-SEAL-2026-X89',
    isAiVerified: true
  };
}
