import { describe, expect, it } from "vitest";
import {
  addChainParams,
  NETWORKS,
  selectNetwork,
  toHexChainId,
  getTxExplorerUrl,
  getAddressExplorerUrl,
  isSupportedChainId,
  findNetworkByChainId
} from "./networks";

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

describe("explorer URL builders", () => {
  it("builds valid transaction explorer URLs when explorer is configured", () => {
    const txHash = "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
    expect(getTxExplorerUrl(NETWORKS.lab, txHash)).toBe(`https://explorer.labchain.la/tx/${txHash}`);
  });

  it("returns empty string when no explorer is configured or txHash is empty", () => {
    expect(getTxExplorerUrl(NETWORKS.ganache, "0x123")).toBe("");
    expect(getTxExplorerUrl(NETWORKS.lab, "")).toBe("");
  });

  it("builds valid address explorer URLs when explorer is configured", () => {
    const address = "0x71C6707321eE51f72b3F3E8E349887114A51f72b";
    expect(getAddressExplorerUrl(NETWORKS.lab, address)).toBe(`https://explorer.labchain.la/address/${address}`);
  });

  it("returns empty string when no explorer is configured or address is empty", () => {
    expect(getAddressExplorerUrl(NETWORKS.ganache, "0x123")).toBe("");
    expect(getAddressExplorerUrl(NETWORKS.lab, "")).toBe("");
  });
});

describe("network validation and lookup", () => {
  it("checks supported chain IDs correctly", () => {
    expect(isSupportedChainId(5222)).toBe(true);
    expect(isSupportedChainId(1337)).toBe(true);
    expect(isSupportedChainId(1)).toBe(false);
    expect(isSupportedChainId(99999)).toBe(false);
  });

  it("resolves network configuration by chain ID", () => {
    expect(findNetworkByChainId(5222)).toBe(NETWORKS.lab);
    expect(findNetworkByChainId(1337)).toBe(NETWORKS.ganache);
    expect(findNetworkByChainId(999)).toBeUndefined();
  });
});
