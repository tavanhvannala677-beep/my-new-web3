// Types for National Single Traceability Platform (ສປປ ລາວ)

export type TraceModel = 'IdentityPreserved' | 'MassBalance' | 'IndividualTrace';

export type CropType = 'Coffee' | 'Cassava' | 'Cattle' | 'Rubber' | 'Sugarcane';

export type ProductType = 
  | 'Arabica_Cherry'
  | 'Robusta_Cherry'
  | 'Roasted_Coffee'
  | 'Cassava_Root'
  | 'Cassava_Chips'
  | 'Cassava_Starch'
  | 'Live_Cattle_RFID';

export type BatchStatus = 
  | 'Registered'
  | 'EUDR_Verified'
  | 'Processed'
  | 'InTransit'
  | 'CustomsCleared'
  | 'Rejected';

export interface GeoJsonPolygon {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: 'Polygon';
      coordinates: number[][][]; // [lng, lat] format
    };
    properties?: {
      farmName?: string;
      areaHectares?: number;
      farmerName?: string;
      cropType?: string;
    };
  }>;
}

export interface TimelineLogItem {
  id: string;
  timestamp: string; // ISO 8601
  stage: 'HARVEST' | 'EUDR_AI' | 'PROCESSING' | 'CUSTOMS_OCR' | 'BORDER_CLEARANCE';
  title: string;
  description: string;
  actor: string;
  txHash?: string;
  ipfsCid?: string;
  status: 'SUCCESS' | 'PENDING' | 'REJECTED';
}

export interface ExtractedPhytoDoc {
  certificateNo: string;
  issueDate: string;
  expiryDate: string;
  orchardCode: string; // GACC standard
  exporterName: string;
  productNameLao: string;
  productNameEN: string;
  productNameZH: string; // 品名 (ຈີນ)
  weightKg: number;
  customsSealNo: string;
  isAiVerified: boolean;
}

export interface BatchItem {
  batchId: string;
  traceModel: TraceModel;
  productType: ProductType;
  quantityKg: number;
  harvestDate: string;
  farmer: {
    name: string;
    phone: string;
    village: string;
    district: string;
    province: string;
  };
  geoJson: GeoJsonPolygon;
  eudrStatus: {
    isPassed: boolean;
    cutoffDate: '2020-12-31';
    ndviScore: number;
    satelliteProvider: 'Sentinel-2 ESA';
    verifiedAt: string;
  };
  phytoDoc?: ExtractedPhytoDoc;
  parentBatchIds?: string[]; // for Mass Balance
  timelineLogs: TimelineLogItem[];
  status: BatchStatus;
  labchainTxHash: string;
  ipfsCid: string;
  createdAt: string;
}

/**
 * Detailed Deforestation Due Diligence Report adhering to EU Regulation 2023/1115 (EUDR).
 */
export interface EudrAuditReport {
  reportCid: string;
  cutoffDate: '2020-12-31';
  ndviScore: number;
  canopyLossPercent: number;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  protectedAreaOverlap: boolean;
  esaSentinelTileId: string;
  isDeforestationFree: boolean;
  analysisTimestamp: string;
}

/**
 * Cross-border railway logistics manifest for the Lao-China Railway freight corridor.
 */
export interface RailTransitManifest {
  manifestNo: string;
  trainNumber: string;
  departureHub: 'Vientiane_South' | 'Thanaleng_Dry_Port' | 'Luang_Prabang';
  destinationHub: 'Mohan' | 'Kunming';
  containerSealNumber: string;
  greenChannelPass: boolean;
  departureTime: string;
  estimatedArrival: string;
}

/**
 * Standard agricultural HS code mapping for bilateral Lao-China customs declarations (GACC).
 */
export interface GaccCustomsCode {
  hsCode: string;
  cropCategory: CropType;
  chineseTitle: string;
  englishTitle: string;
  tariffRatePercent: number;
}

