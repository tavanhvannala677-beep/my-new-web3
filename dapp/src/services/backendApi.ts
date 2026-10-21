/**
 * LaoTrace Backend API Service (Go Backend on port 4001)
 * Base URL: http://localhost:4001/api/v1
 */

export const BACKEND_BASE_URL = 'http://localhost:4001/api/v1';

export interface RegisterBatchPayload {
  batch_id: string;
  product_name: string;
  farm_location: string;
  owner: string;
}

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

// Fallback sample data matching the exact Go Backend specification
export const SAMPLE_GO_BATCH: BatchResponse = {
  status: 'success',
  data: {
    batch: {
      batch_id: 'BATCH-LAO-001',
      product_name: 'ກາເຟອາຣາບິກາ (Arabica Coffee)',
      status: 'ExportCleared',
      owner: '0x71C6707321eE51f72b3F3E8E349887114A51f72b'
    },
    logs: [
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
};

/**
 * Register a new batch to the Go Backend
 * POST http://localhost:4001/api/v1/batch/register
 */
export async function registerBatchToBackend(payload: RegisterBatchPayload): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  isBackendConnected: boolean;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${BACKEND_BASE_URL}/batch/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return { success: true, data, isBackendConnected: true };
  } catch (err: any) {
    console.warn('Go backend not reachable at port 4001, saving locally:', err.message);
    
    // Save to localStorage as seamless fallback
    const localKey = `batch_${payload.batch_id}`;
    const fallbackData: BatchResponse = {
      status: 'success',
      data: {
        batch: {
          batch_id: payload.batch_id,
          product_name: payload.product_name,
          status: 'ExportCleared',
          owner: payload.owner
        },
        logs: [
          {
            verifier: 'AI_EUDR_Engine',
            action: 'EUDR_PASSED (Verified by EUDR AI Engine)',
            evidence_hash: 'Qm' + Math.random().toString(36).substring(2, 15) + 'SatelliteEUDR',
            timestamp: new Date().toISOString()
          },
          {
            verifier: 'AI_CrossBorder_OCR',
            action: 'DOCUMENTS_VERIFIED_AND_TRANSLATED',
            evidence_hash: JSON.stringify({
              product_name: {
                en: 'Specialty Arabica Coffee Beans (Export Grade)',
                zh: '特级阿拉比卡咖啡豆 (出口级)'
              }
            }),
            timestamp: new Date().toISOString()
          }
        ]
      },
      isMockFallback: true
    };
    try {
      localStorage.setItem(localKey, JSON.stringify(fallbackData));
    } catch (e) {
      // Ignore storage errors
    }

    return {
      success: true,
      data: fallbackData,
      isBackendConnected: false,
      error: err.message
    };
  }
}

/**
 * Fetch batch details & AI logs from the Go Backend
 * GET http://localhost:4001/api/v1/batch/:id
 */
export async function fetchBatchFromBackend(batchId: string): Promise<BatchResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${BACKEND_BASE_URL}/batch/${encodeURIComponent(batchId)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const json = await res.json();
    return {
      ...json,
      isMockFallback: false
    };
  } catch (err: any) {
    console.warn(`Could not reach Go Backend for batch ${batchId}, using fallback:`, err.message);

    // Try checking localStorage for locally registered batch
    try {
      const local = localStorage.getItem(`batch_${batchId}`);
      if (local) {
        return JSON.parse(local);
      }
    } catch (e) {
      // ignore
    }

    // Default sample fallback
    return {
      ...SAMPLE_GO_BATCH,
      data: {
        ...SAMPLE_GO_BATCH.data,
        batch: {
          ...SAMPLE_GO_BATCH.data.batch,
          batch_id: batchId
        }
      },
      isMockFallback: true
    };
  }
}

/**
 * Helper to safely parse evidence_hash JSON (used for AI_CrossBorder_OCR)
 */
export function parseEvidenceHash(evidenceHash: string): ParsedEvidenceData {
  try {
    const parsed = JSON.parse(evidenceHash);
    return parsed;
  } catch (e) {
    return { raw_hash: evidenceHash };
  }
}
