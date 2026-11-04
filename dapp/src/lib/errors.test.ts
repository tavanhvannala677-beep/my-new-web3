import { describe, expect, it } from "vitest";
import { errorMessage, isUserRejection, classifyError, formatErrorLao } from "./errors";

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

describe("classifyError", () => {
  it("classifies user rejection correctly", () => {
    expect(classifyError({ code: "ACTION_REJECTED" })).toBe("USER_REJECTED");
    expect(classifyError({ code: 4001 })).toBe("USER_REJECTED");
  });

  it("classifies insufficient gas funds correctly", () => {
    expect(classifyError({ code: "INSUFFICIENT_FUNDS" })).toBe("INSUFFICIENT_FUNDS");
    expect(classifyError({ message: "gas required exceeds balance" })).toBe("INSUFFICIENT_FUNDS");
  });

  it("classifies network errors and timeouts", () => {
    expect(classifyError({ code: "NETWORK_ERROR" })).toBe("NETWORK_ERROR");
    expect(classifyError({ message: "failed to fetch" })).toBe("NETWORK_ERROR");
    expect(classifyError({ code: "TIMEOUT" })).toBe("NETWORK_ERROR");
  });

  it("classifies smart contract execution reverts", () => {
    expect(classifyError({ code: "CALL_EXCEPTION" })).toBe("CONTRACT_REVERT");
    expect(classifyError({ reason: "Unauthorized operator" })).toBe("CONTRACT_REVERT");
    expect(classifyError({ message: "execution reverted: invalid batch ID" })).toBe("CONTRACT_REVERT");
  });

  it("classifies nonce issues", () => {
    expect(classifyError({ code: "NONCE_EXPIRED" })).toBe("NONCE_EXPIRED");
    expect(classifyError({ message: "nonce too low" })).toBe("NONCE_EXPIRED");
  });

  it("falls back to UNKNOWN for unhandled shapes", () => {
    expect(classifyError("random generic string")).toBe("UNKNOWN");
  });
});

describe("formatErrorLao", () => {
  it("formats user rejection in Lao", () => {
    const text = formatErrorLao({ code: 4001 });
    expect(text).toContain("ທ່ານໄດ້ຍົກເລີກການຢືນຢັນ");
  });

  it("formats insufficient funds in Lao with currency symbol", () => {
    const text = formatErrorLao({ code: "INSUFFICIENT_FUNDS" }, "LAB");
    expect(text).toContain("ຍອດເງິນ LAB ບໍ່ພຽງພໍສຳລັບຄ່າ Gas");
  });

  it("formats network timeout in Lao", () => {
    const text = formatErrorLao({ code: "NETWORK_ERROR" });
    expect(text).toContain("ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຄືອຂ່າຍ RPC");
  });

  it("formats contract revert with reason", () => {
    const text = formatErrorLao({ reason: "Not farm owner" });
    expect(text).toContain("Smart Contract ປະຕິເສດທຸລະກຳ: Not farm owner");
  });
});
