import { describe, expect, it } from "vitest";
import { isUint, shortHex } from "./format";

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
