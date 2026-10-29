import { describe, expect, it } from "vitest";
import {
  isUint,
  shortHex,
  isValidEthereumAddress,
  formatDate,
  formatCoordinates,
  formatWeight,
  formatBatchStatusLao
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
