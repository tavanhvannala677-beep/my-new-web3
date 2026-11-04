import { describe, expect, it } from "vitest";
import {
  BatchStatus,
  TraceType,
  getBatchStatusName,
  formatBatchStatusLaoFromEnum,
  getTraceTypeName,
  formatTraceTypeLao,
  isValidTraceType,
  isValidBatchStatus
} from "./laoNationalTraceability";

describe("laoNationalTraceability enum helpers", () => {
  it("converts BatchStatus to English names", () => {
    expect(getBatchStatusName(BatchStatus.Registered)).toBe("Registered");
    expect(getBatchStatusName(BatchStatus.ExportCleared)).toBe("ExportCleared");
    expect(getBatchStatusName(999)).toBe("Unknown");
  });

  it("converts BatchStatus to localized Lao labels", () => {
    expect(formatBatchStatusLaoFromEnum(BatchStatus.Registered)).toContain("ລົງທະບຽນແລ້ວ");
    expect(formatBatchStatusLaoFromEnum(BatchStatus.ExportCleared)).toContain("ຜ່ານດ່ານສຸລະກາກອນແລ້ວ");
    expect(formatBatchStatusLaoFromEnum(999)).toBe("ບໍ່ຮູ້ສະຖານະ (Unknown)");
  });

  it("converts TraceType to English names", () => {
    expect(getTraceTypeName(TraceType.IdentityPreserved)).toBe("IdentityPreserved");
    expect(getTraceTypeName(TraceType.MassBalance)).toBe("MassBalance");
    expect(getTraceTypeName(TraceType.IndividualTrace)).toBe("IndividualTrace");
    expect(getTraceTypeName(999)).toBe("Unknown");
  });

  it("converts TraceType to localized Lao labels", () => {
    expect(formatTraceTypeLao(TraceType.IdentityPreserved)).toContain("ແຍກແຫຼ່ງປູກດ່ຽວ");
    expect(formatTraceTypeLao(TraceType.MassBalance)).toContain("ລວມລັອດການຜະລິດ");
    expect(formatTraceTypeLao(TraceType.IndividualTrace)).toContain("ຕິດຕາມລາຍຕົວ");
  });

  it("validates TraceType and BatchStatus ranges correctly", () => {
    expect(isValidTraceType(TraceType.IdentityPreserved)).toBe(true);
    expect(isValidTraceType(TraceType.IndividualTrace)).toBe(true);
    expect(isValidTraceType(999)).toBe(false);

    expect(isValidBatchStatus(BatchStatus.Registered)).toBe(true);
    expect(isValidBatchStatus(BatchStatus.Rejected)).toBe(true);
    expect(isValidBatchStatus(-1)).toBe(false);
    expect(isValidBatchStatus(5)).toBe(false);
  });
});
