/**
 * Error handling and classification utilities for EVM/ethers.js and MetaMask RPC interactions.
 * Includes localized translations for Lao National Traceability users.
 */

interface RpcLikeError {
  code?: string | number;
  reason?: string | null;
  shortMessage?: string;
  message?: string;
  info?: { error?: { code?: number; message?: string; data?: { reason?: string; message?: string } } };
}

const asError = (err: unknown): RpcLikeError =>
  typeof err === "object" && err !== null ? (err as RpcLikeError) : { message: String(err) };

/** True when the user clicked "Reject" in MetaMask (EIP-1193 code 4001). */
export function isUserRejection(err: unknown): boolean {
  const e = asError(err);
  return e.code === "ACTION_REJECTED" || e.code === 4001 || e.info?.error?.code === 4001;
}

export type ErrorCategory =
  | "USER_REJECTED"
  | "INSUFFICIENT_FUNDS"
  | "NETWORK_ERROR"
  | "CONTRACT_REVERT"
  | "NONCE_EXPIRED"
  | "UNKNOWN";

/**
 * Categorizes an unknown blockchain error into standard diagnostic buckets.
 */
export function classifyError(err: unknown): ErrorCategory {
  if (isUserRejection(err)) return "USER_REJECTED";
  const e = asError(err);
  const msg = (e.message || "").toLowerCase();
  const code = String(e.code || "");

  if (code === "INSUFFICIENT_FUNDS" || msg.includes("insufficient funds") || msg.includes("exceeds balance")) {
    return "INSUFFICIENT_FUNDS";
  }

  if (
    code === "NETWORK_ERROR" ||
    code === "TIMEOUT" ||
    msg.includes("network error") ||
    msg.includes("failed to fetch") ||
    msg.includes("timeout") ||
    msg.includes("connection refused")
  ) {
    return "NETWORK_ERROR";
  }

  if (
    code === "CALL_EXCEPTION" ||
    code === "UNPREDICTABLE_GAS_LIMIT" ||
    msg.includes("execution reverted") ||
    msg.includes("revert") ||
    Boolean(e.reason)
  ) {
    return "CONTRACT_REVERT";
  }

  if (code === "NONCE_EXPIRED" || msg.includes("nonce too low") || msg.includes("already known")) {
    return "NONCE_EXPIRED";
  }

  return "UNKNOWN";
}

/**
 * Turns ethers / MetaMask / node errors into one readable sentence,
 * including the message from a contract's require(..., "message").
 */
export function errorMessage(err: unknown, currencySymbol = "LAB"): string {
  const e = asError(err);
  if (isUserRejection(err)) return "You rejected the request in MetaMask.";
  if (e.code === "INSUFFICIENT_FUNDS") return `Not enough ${currencySymbol} to pay for gas.`;
  const data = e.info?.error?.data;
  return e.reason || data?.reason || data?.message || e.info?.error?.message || e.shortMessage || e.message || "Unknown error";
}

/**
 * Provides user-friendly Lao language error messages for agricultural operators and customs officers.
 */
export function formatErrorLao(err: unknown, currencySymbol = "LAB"): string {
  const category = classifyError(err);
  const original = errorMessage(err, currencySymbol);

  switch (category) {
    case "USER_REJECTED":
      return "ທ່ານໄດ້ຍົກເລີກການຢືນຢັນໃນກະເປົາເງິນ (Transaction cancelled by user)";
    case "INSUFFICIENT_FUNDS":
      return `ຍອດເງິນ ${currencySymbol} ບໍ່ພຽງພໍສຳລັບຄ່າ Gas (Insufficient gas balance)`;
    case "NETWORK_ERROR":
      return "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຄືອຂ່າຍ RPC ຂອງ LAB Chain ໄດ້ (Network unreachable)";
    case "CONTRACT_REVERT":
      return `Smart Contract ປະຕິເສດທຸລະກຳ: ${original}`;
    case "NONCE_EXPIRED":
      return "ເລກທຸລະກຳຊໍ້າຊ້ອນ ຫຼື ລ້າສະໄໝ (Nonce expired / already mined)";
    default:
      return original;
  }
}
