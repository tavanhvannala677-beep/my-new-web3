import { describe, expect, it } from "vitest";
import { addChainParams, NETWORKS, selectNetwork, toHexChainId } from "./networks";

describe("selectNetwork", () => {
  it("defaults to LAB Chain", () => {
    expect(selectNetwork("").chainId).toBe(5222);
    expect(selectNetwork("?address=0xabc").chainId).toBe(5222);
  });

  it("switches to Ganache with ?network=ganache", () => {
    expect(selectNetwork("?network=ganache").chainId).toBe(1337);
  });

  it("ignores unknown network names", () => {
    expect(selectNetwork("?network=mainnet")).toBe(NETWORKS.lab);
    expect(selectNetwork("?network=toString")).toBe(NETWORKS.lab);
  });
});

describe("chain params for MetaMask", () => {
  it("encodes LAB Chain's ID as 0x1466", () => {
    expect(toHexChainId(5222)).toBe("0x1466");
  });

  it("includes the explorer only when there is one", () => {
    expect(addChainParams(NETWORKS.lab)).toMatchObject({
      chainId: "0x1466",
      rpcUrls: ["https://rpc.labchain.la"],
      blockExplorerUrls: ["https://explorer.labchain.la"]
    });
    expect(addChainParams(NETWORKS.ganache)).not.toHaveProperty("blockExplorerUrls");
  });
});
