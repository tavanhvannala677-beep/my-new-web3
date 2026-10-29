/**
 * LaoTrace Backend API Service (Go Backend on port 4001)
 * Base URL: http://localhost:4001/api/v1
 */

export const BACKEND_BASE_URL = (import.meta as any).env?.VITE_BACKEND_API_URL || 'http://localhost:4001/api/v1';

// 1. Register Batch
export interface RegisterBatchPayload {
  batch_id: string;
  product_name: string;
  farm_location: string;
  owner: string;
}

// 2. Merge Batches
export interface MergeBatchPayload {
  new_batch_id: string;
  product_name: string;
  parent_batches: string[];
  quantity: number;
  owner: string;
}

// 3. AI Verify
export interface AiVerifyPayload {
  batch_id: string;
}

// 4. Customs Clearance
export interface CustomsClearancePayload {
  batch_id: string;
  action: string;
  evidence_hash: string;
}

// Verification Log
export interface VerificationLog {
  verifier: string;
  action: string;
  evidence_hash: string;
  timestamp: string;
}

export interface ParsedEvidenceData {
  product_name?: {
    en?: string;
    zh?: string;
    la?: string;
  };
  raw_hash?: string;
}

export interface BatchData {
  batch_id: string;
  product_name: string;
  status: string;
  owner: string;
  farm_location?: string;
  quantity?: number;
  parent_batches?: string[];
}

export interface BatchResponse {
  status: 'success' | 'error';
  message?: string;
  data: {
    batch: BatchData;
    logs: VerificationLog[];
  };
  isMockFallback?: boolean;
}

// In-memory / localStorage cache for seamless demo experience
function getLocalBatch(id: string): BatchResponse | null {
  try {
    const raw = localStorage.getItem(`laotrace_batch_${id}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return null;
}

function saveLocalBatch(id: string, data: BatchResponse) {
  try {
    localStorage.setItem(`laotrace_batch_${id}`, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

// Default Seed Batches
export const DEFAULT_BATCHES: Record<string, BatchResponse> = {
  'BATCH-LAO-001': {
    status: 'success',
    data: {
      batch: {
        batch_id: 'BATCH-LAO-001',
        product_name: 'ກາເຟອາຣາບິກາ (Arabica Coffee)',
        farm_location: '15.1764, 106.2341 (Paksong Highland, Champasak)',
        status: 'ExportCleared',
        owner: 'ສົມສັກ ພອນສະຫວັນ (Somsack)'
      },
      logs: [
        {
          verifier: 'Farmer_App',
          action: 'BATCH_REGISTERED_WITH_GIS_POLYGON',
          evidence_hash: 'QmFarmGISPolygonPlotA1517641062341',
          timestamp: '2026-10-21T18:00:00Z'
        },
        {
          verifier: 'AI_EUDR_Engine',
          action: 'EUDR_PASSED (Verified by EUDR AI Engine)',
          evidence_hash: 'QmXyZMockHashForSatelliteImage12345',
          timestamp: '2026-10-21T20:30:00Z'
        },
        {
          verifier: 'AI_CrossBorder_OCR',
          action: 'DOCUMENTS_VERIFIED_AND_TRANSLATED',
          evidence_hash: '{"product_name":{"en":"Fresh Arabica Coffee Beans","zh":"新鲜阿拉比卡咖啡豆"}}',
          timestamp: '2026-10-21T21:00:00Z'
        }
      ]
    },
    isMockFallback: true
  },
  'FACTORY-001': {
    status: 'success',
    data: {
      batch: {
        batch_id: 'FACTORY-001',
        product_name: 'Roasted Coffee Blend (Export Grade)',
        quantity: 5000.5,
        parent_batches: ['BATCH-LAO-001', 'BATCH-LAO-002'],
        status: 'GACC_CLEARED_GREEN_CHANNEL',
        owner: 'ໂຮງງານແປຮູບກາເຟດາວ (Dao Coffee Factory)'
      },
      logs: [
        {
          verifier: 'Factory_Portal',
          action: 'BATCH_MERGED_FROM_PARENTS',
          evidence_hash: 'Parents: BATCH-LAO-001, BATCH-LAO-002 (5000.5 kg)',
          timestamp: '2026-10-21T21:30:00Z'
        },
        {
          verifier: 'AI_EUDR_Engine',
          action: 'EUDR_PASSED (Verified by EUDR AI Engine)',
          evidence_hash: 'QmSentinel2VerifiedCanopyScore085',
          timestamp: '2026-10-21T21:45:00Z'
        },
        {
          verifier: 'Customs_Inspector',
          action: 'GACC_CLEARED_GREEN_CHANNEL',
          evidence_hash: 'Customs Officer Verified #8812 - Mohan/Boten Border',
          timestamp: '2026-10-21T22:15:00Z'
        }
      ]
    },
    isMockFallback: true
  }
};

/**
 * 1. Register a new batch (Farmer Portal)
 * POST /batch/register
 */
export async function registerBatchToBackend(payload: RegisterBatchPayload): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  isBackendConnected: boolean;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${BACKEND_BASE_URL}/batch/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    return { success: true, data, isBackendConnected: true };
  } catch (err: any) {
    console.warn('Go backend unreachable at port 4001, saving locally:', err.message);

    const newLocalBatch: BatchResponse = {
      status: 'success',
      data: {
        batch: {
          batch_id: payload.batch_id,
          product_name: payload.product_name,
          farm_location: payload.farm_location,
          status: 'Registered',
          owner: payload.owner
        },
        logs: [
          {
            verifier: 'Farmer_App',
            action: 'BATCH_REGISTERED_WITH_GIS_MAP',
            evidence_hash: `GPS: ${payload.farm_location}`,
            timestamp: new Date().toISOString()
          }
        ]
      },
      isMockFallback: true
    };
    saveLocalBatch(payload.batch_id, newLocalBatch);

    return {
      success: true,
      data: newLocalBatch,
      isBackendConnected: false,
      error: err.message
    };
  }
}

/**
 * 2. Merge batches (Factory Portal)
 * POST /batch/merge
 */
export async function mergeBatchesToBackend(payload: MergeBatchPayload): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  isBackendConnected: boolean;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${BACKEND_BASE_URL}/batch/merge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    return { success: true, data, isBackendConnected: true };
  } catch (err: any) {
    console.warn('Go backend unreachable at port 4001, saving merged batch locally:', err.message);

    const newMergedBatch: BatchResponse = {
      status: 'success',
      data: {
        batch: {
          batch_id: payload.new_batch_id,
          product_name: payload.product_name,
          quantity: payload.quantity,
          parent_batches: payload.parent_batches,
          status: 'Merged_ExportReady',
          owner: payload.owner
        },
        logs: [
          {
            verifier: 'Factory_Portal',
            action: 'BATCH_MERGED_FROM_PARENTS',
            evidence_hash: `Parents: ${payload.parent_batches.join(', ')} (${payload.quantity} kg)`,
            timestamp: new Date().toISOString()
          }
        ]
      },
      isMockFallback: true
    };
    saveLocalBatch(payload.new_batch_id, newMergedBatch);

    return {
      success: true,
      data: newMergedBatch,
      isBackendConnected: false,
      error: err.message
    };
  }
}

/**
 * 3. AI Verify (Satellite EUDR)
 * POST /batch/ai-verify
 */
export async function runAiVerify(batch_id: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  isBackendConnected: boolean;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${BACKEND_BASE_URL}/batch/ai-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batch_id }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    return { success: true, data, isBackendConnected: true };
  } catch (err: any) {
    console.warn('Go backend unreachable, simulating AI EUDR verification locally:', err.message);

    // Update local batch logs
    const existing = getLocalBatch(batch_id) || DEFAULT_BATCHES[batch_id] || DEFAULT_BATCHES['BATCH-LAO-001'];
    const updated: BatchResponse = {
      ...existing,
      data: {
        ...existing.data,
        logs: [
          ...existing.data.logs.filter(l => l.verifier !== 'AI_EUDR_Engine'),
          {
            verifier: 'AI_EUDR_Engine',
            action: 'EUDR_PASSED (Verified by EUDR AI Engine)',
            evidence_hash: 'QmSentinel2VerifiedCanopyScore086NDVI',
            timestamp: new Date().toISOString()
          }
        ]
      },
      isMockFallback: true
    };
    saveLocalBatch(batch_id, updated);

    return {
      success: true,
      data: updated,
      isBackendConnected: false,
      error: err.message
    };
  }
}

/**
 * 4. Customs Clearance / Document OCR
 * POST /batch/customs-clearance
 */
export async function runCustomsClearance(payload: CustomsClearancePayload): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  isBackendConnected: boolean;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${BACKEND_BASE_URL}/batch/customs-clearance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const data = await res.json();
    return { success: true, data, isBackendConnected: true };
  } catch (err: any) {
    console.warn('Go backend unreachable, recording customs clearance locally:', err.message);

    // Update local batch
    const existing = getLocalBatch(payload.batch_id) || DEFAULT_BATCHES[payload.batch_id] || DEFAULT_BATCHES['BATCH-LAO-001'];
    const isApproval = payload.action === 'GACC_CLEARED_GREEN_CHANNEL';

    const updated: BatchResponse = {
      ...existing,
      data: {
        ...existing.data,
        batch: {
          ...existing.data.batch,
          status: isApproval ? 'GACC_CLEARED_GREEN_CHANNEL' : existing.data.batch.status
        },
        logs: [
          ...existing.data.logs,
          {
            verifier: isApproval ? 'Customs_Inspector' : 'AI_CrossBorder_OCR',
            action: payload.action,
            evidence_hash: payload.evidence_hash,
            timestamp: new Date().toISOString()
          }
        ]
      },
      isMockFallback: true
    };
    saveLocalBatch(payload.batch_id, updated);

    return {
      success: true,
      data: updated,
      isBackendConnected: false,
      error: err.message
    };
  }
}

/**
 * 5. Fetch batch details & logs
 * GET /batch/:id
 */
export async function fetchBatchFromBackend(batchId: string): Promise<BatchResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${BACKEND_BASE_URL}/batch/${encodeURIComponent(batchId)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const json = await res.json();
    return { ...json, isMockFallback: false };
  } catch (err: any) {
    // Check local storage first
    const local = getLocalBatch(batchId);
    if (local) return local;

    // Check defaults
    if (DEFAULT_BATCHES[batchId]) {
      return DEFAULT_BATCHES[batchId];
    }

    // Dynamic fallback for any unknown batch ID
    return {
      status: 'success',
      data: {
        batch: {
          batch_id: batchId,
          product_name: 'ກາເຟອາຣາບິກາພິເສດ (Specialty Arabica)',
          farm_location: '15.1764, 106.2341 (Paksong, Champasak)',
          status: 'ExportCleared',
          owner: '0x71C6707321eE51f72b3F3E8E349887114A51f72b'
        },
        logs: [
          {
            verifier: 'Farmer_App',
            action: 'BATCH_REGISTERED_WITH_GIS_MAP',
            evidence_hash: 'GPS: 15.1764, 106.2341',
            timestamp: '2026-10-21T18:00:00Z'
          },
          {
            verifier: 'AI_EUDR_Engine',
            action: 'EUDR_PASSED (Verified by EUDR AI Engine)',
            evidence_hash: 'QmSentinel2NDVIScore084Cutoff2020',
            timestamp: '2026-10-21T20:30:00Z'
          },
          {
            verifier: 'AI_CrossBorder_OCR',
            action: 'DOCUMENTS_VERIFIED_AND_TRANSLATED',
            evidence_hash: '{"product_name":{"en":"Specialty Arabica Coffee Beans","zh":"老挝特级阿拉比卡咖啡豆"}}',
            timestamp: '2026-10-21T21:00:00Z'
          }
        ]
      },
      isMockFallback: true
    };
  }
}

/**
 * Helper to safely parse evidence_hash JSON (used for AI_CrossBorder_OCR)
 *
 * @param evidenceHash - JSON string or raw IPFS/GPS hash
 * @returns ParsedEvidenceData containing multilingual names or raw_hash fallback
 */
export function parseEvidenceHash(evidenceHash: string): ParsedEvidenceData {
  try {
    const parsed = JSON.parse(evidenceHash);
    return parsed;
  } catch (e) {
    return { raw_hash: evidenceHash };
  }
}

/**
 * Validates whether a batch identifier adheres to the Lao National standard format.
 * Format examples: BATCH-LAO-001, BATCH-PAKSONG-2026, BATCH-COFFEE-889
 *
 * @param batchId - The batch identifier string to validate
 * @returns boolean indicating valid naming convention
 */
export function validateBatchIdFormat(batchId: string): boolean {
  if (!batchId || typeof batchId !== "string") return false;
  const regex = /^BATCH-[A-Z0-9_-]+$/i;
  return regex.test(batchId.trim());
}

export interface BatchFilterOptions {
  status?: string;
  search?: string;
}

/**
 * In-memory search and filter helper for batch collections.
 * Supports filtering by status and searching across batch ID, product name, and farm location.
 *
 * @param batches - Array of BatchData records
 * @param filter - Options containing status criteria and text search query
 * @returns Filtered array of BatchData records
 */
export function filterBatches(batches: BatchData[], filter: BatchFilterOptions): BatchData[] {
  if (!Array.isArray(batches)) return [];
  const query = (filter.search || "").toLowerCase().trim();
  const statusFilter = (filter.status || "").toLowerCase().trim();

  return batches.filter((b) => {
    // 1. Status match
    if (statusFilter && statusFilter !== "all") {
      if ((b.status || "").toLowerCase() !== statusFilter) {
        return false;
      }
    }

    // 2. Text search match
    if (query) {
      const matchId = (b.batch_id || "").toLowerCase().includes(query);
      const matchProduct = (b.product_name || "").toLowerCase().includes(query);
      const matchLoc = (b.farm_location || "").toLowerCase().includes(query);
      const matchOwner = (b.owner || "").toLowerCase().includes(query);
      return matchId || matchProduct || matchLoc || matchOwner;
    }

    return true;
  });
}

/**
 * Generates an immutable, printable JSON audit passport for Customs & Trade compliance.
 *
 * @param batch - The core BatchData record
 * @param logs - Array of VerificationLog events recorded on-chain or off-chain
 * @returns Pretty-formatted JSON string representation
 */
export function exportBatchSummaryAsJson(batch: BatchData, logs: VerificationLog[] = []): string {
  const auditPassport = {
    platform: "Lao National Single Traceability Platform (LaoTrace)",
    standard: "EUDR / GACC Cross-Border Compliant",
    generatedAt: new Date().toISOString(),
    batch: {
      batchId: batch.batch_id,
      productName: batch.product_name,
      status: batch.status,
      farmLocation: batch.farm_location || "N/A",
      owner: batch.owner,
      quantityKg: batch.quantity || 0,
      parentBatches: batch.parent_batches || []
    },
    verificationHistory: logs.map((log, index) => ({
      sequence: index + 1,
      timestamp: log.timestamp,
      verifier: log.verifier,
      action: log.action,
      evidenceHash: log.evidence_hash
    }))
  };

  return JSON.stringify(auditPassport, null, 2);
}

