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
