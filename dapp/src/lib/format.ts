/**
 * Utility functions for formatting addresses, numbers, dates, and geographic data.
 * Designed for the Lao National Single Traceability Platform (LaoTrace).
 */

export const shortHex = (value: string): string =>
  value.length > 12 ? `${value.slice(0, 6)}…${value.slice(-4)}` : value;

/** Whole, non-negative decimal number — what store(uint256) accepts from the form. */
export const isUint = (value: string): boolean => /^\d+$/.test(value.trim());

/**
 * Checks if a given string is a valid Ethereum/EVM hex address (0x + 40 hex chars).
 */
export const isValidEthereumAddress = (value: string): boolean =>
  /^0x[a-fA-F0-9]{40}$/.test(value.trim());

/**
 * Format ISO 8601 string or Unix timestamp into a readable date-time string.
 * Supports both string representations and numeric timestamps.
 */
export const formatDate = (input: string | number | Date): string => {
  if (!input) return "-";
  try {
    const d = typeof input === "number" && input < 1e11 ? new Date(input * 1000) : new Date(input);
    if (isNaN(d.getTime())) return String(input);
    return d.toISOString().replace("T", " ").substring(0, 19);
  } catch {
    return String(input);
  }
};

/**
 * Format latitude and longitude coordinates into human-readable GPS notation.
 * e.g., formatCoordinates(15.1764, 106.2341) => "15.1764° N, 106.2341° E"
 */
export const formatCoordinates = (lat: number, lng: number, precision: number = 4): string => {
  if (isNaN(lat) || isNaN(lng)) return "-";
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(precision)}° ${latDir}, ${Math.abs(lng).toFixed(precision)}° ${lngDir}`;
};

/**
 * Format weight in kilograms into a readable format with metric tons (MT).
 * e.g., formatWeight(5000) => "5,000 kg (5.00 MT)"
 */
export const formatWeight = (kg: number): string => {
  if (isNaN(kg) || kg < 0) return "0 kg";
  const formattedKg = kg.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (kg >= 1000) {
    const tons = (kg / 1000).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${formattedKg} kg (${tons} MT)`;
  }
  return `${formattedKg} kg`;
};

/**
 * Translate internal batch status to Lao language label.
 */
export const formatBatchStatusLao = (status: string): string => {
  switch (status) {
    case "Registered":
      return "ລົງທະບຽນແລ້ວ";
    case "EUDR_Verified":
      return "ກວດສອບ EUDR ຜ່ານແລ້ວ";
    case "Processed":
      return "ໂຮງງານແປຮູບແລ້ວ";
    case "InTransit":
      return "ກຳລັງຂົນສົ່ງ";
    case "ExportCleared":
    case "CustomsCleared":
      return "ຜ່ານດ່ານສຸລະກາກອນແລ້ວ";
    case "Rejected":
      return "ຖືກປະຕິເສດ";
    default:
      return status || "-";
  }
};

export type StatusKind = "idle" | "pending" | "ok" | "error";

export interface Status {
  kind: StatusKind;
  message: string;
  txHash?: string;
}

export const IDLE: Status = { kind: "idle", message: "" };
