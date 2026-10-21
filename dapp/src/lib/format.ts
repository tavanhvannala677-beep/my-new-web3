export const shortHex = (value: string) => (value.length > 12 ? `${value.slice(0, 6)}…${value.slice(-4)}` : value);

/** Whole, non-negative decimal number — what store(uint256) accepts from the form. */
export const isUint = (value: string) => /^\d+$/.test(value.trim());

export type StatusKind = "idle" | "pending" | "ok" | "error";

export interface Status {
  kind: StatusKind;
  message: string;
  txHash?: string;
}

export const IDLE: Status = { kind: "idle", message: "" };
