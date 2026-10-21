export interface NetworkConfig {
  key: string;
  chainId: number;
  chainName: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export const NETWORKS = {
  lab: {
    key: "lab",
    chainId: 5222,
    chainName: "LAB Chain",
    nativeCurrency: { name: "LAB", symbol: "LAB", decimals: 18 },
    rpcUrls: ["https://rpc.labchain.la"],
    blockExplorerUrls: ["https://explorer.labchain.la"]
  },
  // Local practice chain: Ganache GUI on its default port
  ganache: {
    key: "ganache",
    chainId: 1337,
    chainName: "Ganache (local)",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["http://127.0.0.1:7545"],
    blockExplorerUrls: []
  }
} satisfies Record<string, NetworkConfig>;

export type NetworkKey = keyof typeof NETWORKS;

/** LAB Chain by default; `?network=ganache` switches to the local chain. */
export function selectNetwork(search: string): NetworkConfig {
  const key = new URLSearchParams(search).get("network");
  return key && Object.hasOwn(NETWORKS, key) ? NETWORKS[key as NetworkKey] : NETWORKS.lab;
}

export const toHexChainId = (chainId: number) => "0x" + chainId.toString(16);

export const explorerUrl = (network: NetworkConfig) => network.blockExplorerUrls[0] ?? "";

/** Params for MetaMask's wallet_addEthereumChain (explorer omitted when there is none). */
export function addChainParams(network: NetworkConfig) {
  return {
    chainId: toHexChainId(network.chainId),
    chainName: network.chainName,
    nativeCurrency: network.nativeCurrency,
    rpcUrls: network.rpcUrls,
    ...(network.blockExplorerUrls.length ? { blockExplorerUrls: network.blockExplorerUrls } : {})
  };
}
