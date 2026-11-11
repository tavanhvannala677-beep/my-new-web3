import { describe, expect, it } from "vitest";
import {
  isUint,
  shortHex,
  isValidEthereumAddress,
  formatDate,
  formatCoordinates,
  formatWeight,
  formatBatchStatusLao,
  safeJsonParse,
  isDarkColor,
  hexToRgba,
  rgbToHex,
  adjustBrightness,
  hexToHsl,
  hslToRgb
} from "./format";

describe("isUint", () => {
  it("accepts whole non-negative numbers", () => {
    expect(isUint("0")).toBe(true);
    expect(isUint(" 42 ")).toBe(true);
    expect(isUint("115792089237316195423570985008687907853269984665640564039457584007913129639935")).toBe(true);
  });

  it("rejects decimals, negatives and empty input", () => {
    for (const bad of ["", "1.5", "-1", "1e3", "abc"]) expect(isUint(bad)).toBe(false);
  });
});

describe("shortHex", () => {
  it("shortens addresses and hashes", () => {
    expect(shortHex("0x1111111111111111111111111111111111111111")).toBe("0x1111…1111");
    expect(shortHex("0x1234")).toBe("0x1234");
  });
});

describe("isValidEthereumAddress", () => {
  it("validates correct 40-character hex addresses", () => {
    expect(isValidEthereumAddress("0x71C6707321eE51f72b3F3E8E349887114A51f72b")).toBe(true);
    expect(isValidEthereumAddress("0x0000000000000000000000000000000000000000")).toBe(true);
  });

  it("rejects invalid addresses", () => {
    expect(isValidEthereumAddress("0x1234")).toBe(false);
    expect(isValidEthereumAddress("not-an-address")).toBe(false);
    expect(isValidEthereumAddress("0xZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ")).toBe(false);
  });
});

describe("formatDate", () => {
  it("formats ISO string correctly", () => {
    expect(formatDate("2026-10-21T18:00:00Z")).toBe("2026-10-21 18:00:00");
  });

  it("handles empty or invalid dates gracefully", () => {
    expect(formatDate("")).toBe("-");
    expect(formatDate("invalid-date")).toBe("invalid-date");
  });
});

describe("formatCoordinates", () => {
  it("formats positive and negative lat/lng to GPS notation", () => {
    expect(formatCoordinates(15.1764, 106.2341)).toBe("15.1764° N, 106.2341° E");
    expect(formatCoordinates(-33.8688, 151.2093, 2)).toBe("33.87° S, 151.21° E");
  });

  it("handles NaN gracefully", () => {
    expect(formatCoordinates(NaN, 106)).toBe("-");
  });
});

describe("formatWeight", () => {
  it("formats kilograms and metric tons", () => {
    expect(formatWeight(500)).toBe("500 kg");
    expect(formatWeight(5000)).toBe("5,000 kg (5.00 MT)");
    expect(formatWeight(12500)).toBe("12,500 kg (12.50 MT)");
  });

  it("handles negative or invalid weight gracefully", () => {
    expect(formatWeight(-10)).toBe("0 kg");
    expect(formatWeight(NaN)).toBe("0 kg");
  });
});

describe("formatBatchStatusLao", () => {
  it("translates known statuses to Lao", () => {
    expect(formatBatchStatusLao("Registered")).toBe("ລົງທະບຽນແລ້ວ");
    expect(formatBatchStatusLao("EUDR_Verified")).toBe("ກວດສອບ EUDR ຜ່ານແລ້ວ");
    expect(formatBatchStatusLao("ExportCleared")).toBe("ຜ່ານດ່ານສຸລະກາກອນແລ້ວ");
  });

  it("returns raw status for unknown inputs", () => {
    expect(formatBatchStatusLao("CustomStatus")).toBe("CustomStatus");
  });
});

describe("safeJsonParse", () => {
  it("parses valid JSON strings", () => {
    expect(safeJsonParse('{"ok": true}', {})).toEqual({ ok: true });
    expect(safeJsonParse('[1, 2, 3]', [])).toEqual([1, 2, 3]);
  });

  it("returns fallback for invalid or empty inputs", () => {
    expect(safeJsonParse('not-a-json', { fallback: true })).toEqual({ fallback: true });
    expect(safeJsonParse(null, 'default')).toBe('default');
    expect(safeJsonParse('', 42)).toBe(42);
  });
});

describe("isDarkColor", () => {
  it("identifies dark colors correctly", () => {
    expect(isDarkColor("#000000")).toBe(true);
    expect(isDarkColor("#153826")).toBe(true); // Forest dark
    expect(isDarkColor("#142a1d")).toBe(true); // Text main
  });

  it("identifies light colors correctly", () => {
    expect(isDarkColor("#ffffff")).toBe(false);
    expect(isDarkColor("#edf2e7")).toBe(false); // BG primary
    expect(isDarkColor("#fff")).toBe(false);
  });

  it("handles malformed hex strings gracefully", () => {
    expect(isDarkColor("not-a-color")).toBe(false);
    expect(isDarkColor("")).toBe(false);
  });
});

describe("hexToRgba", () => {
  it("converts 6-digit hex color with default alpha 1", () => {
    expect(hexToRgba("#ffffff")).toBe("rgba(255, 255, 255, 1)");
    expect(hexToRgba("#000000")).toBe("rgba(0, 0, 0, 1)");
    expect(hexToRgba("#10b981", 0.5)).toBe("rgba(16, 185, 129, 0.5)");
  });

  it("converts 3-digit hex color shorthand", () => {
    expect(hexToRgba("#fff")).toBe("rgba(255, 255, 255, 1)");
    expect(hexToRgba("#000", 0.8)).toBe("rgba(0, 0, 0, 0.8)");
  });

  it("handles alpha clamping and invalid input gracefully", () => {
    expect(hexToRgba("#ffffff", 1.5)).toBe("rgba(255, 255, 255, 1)");
    expect(hexToRgba("#ffffff", -0.5)).toBe("rgba(255, 255, 255, 0)");
    expect(hexToRgba("bad-hex")).toBe("rgba(0, 0, 0, 1)");
  });
});

describe("rgbToHex", () => {
  it("converts standard RGB values to hex string", () => {
    expect(rgbToHex(255, 255, 255)).toBe("#ffffff");
    expect(rgbToHex(0, 0, 0)).toBe("#000000");
    expect(rgbToHex(16, 185, 129)).toBe("#10b981");
    expect(rgbToHex(21, 56, 38)).toBe("#153826");
  });

  it("clamps values outside 0-255 range", () => {
    expect(rgbToHex(-10, 300, 100)).toBe("#00ff64");
    expect(rgbToHex(-50, -20, 999)).toBe("#0000ff");
  });

  it("handles floating point and NaN inputs safely", () => {
    expect(rgbToHex(254.8, 12.2, 0)).toBe("#ff0c00");
    expect(rgbToHex(NaN, NaN, NaN)).toBe("#000000");
  });
});

describe("adjustBrightness", () => {
  it("lightens a dark color when given positive percentage", () => {
    const lightened = adjustBrightness("#000000", 50);
    expect(lightened).toBe("#808080");
  });

  it("darkens a light color when given negative percentage", () => {
    const darkened = adjustBrightness("#ffffff", -50);
    expect(darkened).toBe("#808080");
  });

  it("handles shorthand 3-digit hex strings", () => {
    expect(adjustBrightness("#fff", 0)).toBe("#ffffff");
    expect(adjustBrightness("#000", 100)).toBe("#ffffff");
  });

  it("clamps to bounds and handles invalid hex input", () => {
    expect(adjustBrightness("#ffffff", 50)).toBe("#ffffff");
    expect(adjustBrightness("#000000", -50)).toBe("#000000");
    expect(adjustBrightness("invalid", 20)).toBe("#000000");
  });
});

describe("hexToHsl", () => {
  it("converts pure white and pure black correctly", () => {
    expect(hexToHsl("#ffffff")).toEqual({ h: 0, s: 0, l: 100 });
    expect(hexToHsl("#000000")).toEqual({ h: 0, s: 0, l: 0 });
  });

  it("converts pure primary colors (red, green, blue)", () => {
    expect(hexToHsl("#ff0000")).toEqual({ h: 0, s: 100, l: 50 });
    expect(hexToHsl("#00ff00")).toEqual({ h: 120, s: 100, l: 50 });
    expect(hexToHsl("#0000ff")).toEqual({ h: 240, s: 100, l: 50 });
  });

  it("handles 3-character hex and invalid values", () => {
    expect(hexToHsl("#fff")).toEqual({ h: 0, s: 0, l: 100 });
    expect(hexToHsl("invalid")).toEqual({ h: 0, s: 0, l: 0 });
  });
});

describe("hslToRgb", () => {
  it("converts pure white and black correctly", () => {
    expect(hslToRgb(0, 0, 100)).toBe("#ffffff");
    expect(hslToRgb(0, 0, 0)).toBe("#000000");
  });

  it("converts pure primary hues (red, green, blue)", () => {
    expect(hslToRgb(0, 100, 50)).toBe("#ff0000");
    expect(hslToRgb(120, 100, 50)).toBe("#00ff00");
    expect(hslToRgb(240, 100, 50)).toBe("#0000ff");
  });

  it("handles out of bound degrees and NaN", () => {
    expect(hslToRgb(360, 100, 50)).toBe("#ff0000");
    expect(hslToRgb(NaN, NaN, NaN)).toBe("#000000");
  });
});






