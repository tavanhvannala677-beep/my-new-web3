import { describe, expect, it } from "vitest";
import { errorMessage, isUserRejection } from "./errors";

describe("errorMessage", () => {
  it("explains a MetaMask rejection (ethers and raw EIP-1193 shapes)", () => {
    expect(errorMessage({ code: "ACTION_REJECTED" })).toBe("You rejected the request in MetaMask.");
    expect(errorMessage({ code: 4001, message: "User rejected" })).toBe("You rejected the request in MetaMask.");
    expect(isUserRejection({ info: { error: { code: 4001 } } })).toBe(true);
  });

  it("names the right currency when gas money is missing", () => {
    expect(errorMessage({ code: "INSUFFICIENT_FUNDS" }, "LAB")).toBe("Not enough LAB to pay for gas.");
  });

  it("surfaces the contract's require() reason", () => {
    expect(errorMessage({ reason: "Counter: already zero", shortMessage: "execution reverted" })).toBe("Counter: already zero");
    expect(errorMessage({ shortMessage: "missing revert data", info: { error: { data: { reason: "Voting: already voted" } } } })).toBe(
      "Voting: already voted"
    );
  });

  it("falls back to the short message, then any message", () => {
    expect(errorMessage({ shortMessage: "could not coalesce error", message: "long text" })).toBe("could not coalesce error");
    expect(errorMessage("boom")).toBe("boom");
  });
});
