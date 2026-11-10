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

/**
 * Safely parses a JSON string with a strongly typed fallback value if parsing throws.
 */
export function safeJsonParse<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString || typeof jsonString !== "string") return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}

/**
 * Computes whether a hex color code is perceptually dark (luminance < 0.5)
 * useful for dynamic contrast text selection (black vs white).
 */
export function isDarkColor(hexColor: string): boolean {
  if (!hexColor || typeof hexColor !== "string") return false;
  const hex = hexColor.replace("#", "").trim();
  if (hex.length !== 3 && hex.length !== 6) return false;

  let r: number, g: number, b: number;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  // Relative luminance formula per ITU-R BT.709
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.5;
}

/**
 * Converts a 3 or 6-digit hex color into an `rgba(r, g, b, alpha)` string.
 * Defaults to alpha=1 if not specified or clamped between 0 and 1.
 */
export function hexToRgba(hexColor: string, alpha: number = 1): string {
  if (!hexColor || typeof hexColor !== "string") return "rgba(0, 0, 0, 1)";
  const hex = hexColor.replace("#", "").trim();
  if (hex.length !== 3 && hex.length !== 6) return "rgba(0, 0, 0, 1)";

  let r: number, g: number, b: number;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  const safeAlpha = Math.max(0, Math.min(1, isNaN(alpha) ? 1 : alpha));
  return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
}

/**
 * Converts RGB numerical components (0-255) to a standard 6-character hex color string.
 * Clamps input values to [0, 255] and handles non-integer numbers gracefully.
 * e.g., rgbToHex(16, 185, 129) => "#10b981"
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(isNaN(v) ? 0 : v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Adjusts the brightness of a hex color by a percentage (-100 to +100).
 * Positive percentages lighten the color, negative percentages darken it.
 * Clamps output RGB components to [0, 255].
 * e.g., adjustBrightness("#10b981", 20) => lightened emerald
 */
export function adjustBrightness(hexColor: string, percent: number): string {
  if (!hexColor || typeof hexColor !== "string") return "#000000";
  const hex = hexColor.replace("#", "").trim();
  if (hex.length !== 3 && hex.length !== 6) return "#000000";

  let r: number, g: number, b: number;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  const factor = isNaN(percent) ? 0 : percent / 100;
  const adjust = (c: number) => {
    const target = factor > 0 ? 255 : 0;
    const diff = target - c;
    return Math.max(0, Math.min(255, Math.round(c + diff * Math.abs(factor))));
  };

  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(adjust(r))}${toHex(adjust(g))}${toHex(adjust(b))}`;
}





