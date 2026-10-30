import { formatUnits, type JsonRpcProvider } from "ethers";
import { useEffect, useState } from "react";
import type { NetworkConfig } from "../config/networks";
import { errorMessage } from "../lib/errors";

export type NetworkHealth = "optimal" | "degraded" | "offline" | "checking";

export interface NetworkStatus {
  online: boolean | null;
  liveChainId: number | null;
  blockNumber: number | null;
  gasPriceGwei: string | null;
  latencyMs: number | null;
  health: NetworkHealth;
  lastChecked: string | null;
  error: string | null;
}

const POLL_MS = 6000;

/**
 * Returns a human-friendly label and color indicator for blockchain connection health.
 */
export function getHealthBadgeLabel(health: NetworkHealth): { text: string; color: string } {
  switch (health) {
    case "optimal":
      return { text: "Fast (<300ms)", color: "#10b981" };
    case "degraded":
      return { text: "Slow (>300ms)", color: "#f59e0b" };
    case "offline":
      return { text: "Offline", color: "#ef4444" };
    default:
      return { text: "Checking...", color: "#94a3b8" };
  }
}

/**
 * Hook that continuously polls the public RPC endpoint to verify live chain connectivity,
 * measure network latency in milliseconds, track latest block heights, and estimate gas fees.
 */
export function useNetworkStatus(network: NetworkConfig, provider: JsonRpcProvider): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    online: null,
    liveChainId: null,
    blockNumber: null,
    gasPriceGwei: null,
    latencyMs: null,
    health: "checking",
    lastChecked: null,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const startTime = performance.now();
      try {
        const [chainHex, blockNumber, fee] = await Promise.all([
          provider.send("eth_chainId", []) as Promise<string>,
          provider.getBlockNumber(),
          provider.getFeeData()
        ]);

        if (cancelled) return;
        const latencyMs = Math.round(performance.now() - startTime);
        const health: NetworkHealth = latencyMs < 300 ? "optimal" : "degraded";

        setStatus({
          online: true,
          liveChainId: Number(chainHex),
          blockNumber,
          gasPriceGwei: fee.gasPrice != null ? formatUnits(fee.gasPrice, "gwei") : null,
          latencyMs,
          health,
          lastChecked: new Date().toLocaleTimeString(),
          error: null
        });
      } catch (err) {
        if (!cancelled) {
          setStatus((s) => ({
            ...s,
            online: false,
            latencyMs: null,
            health: "offline",
            lastChecked: new Date().toLocaleTimeString(),
            error: errorMessage(err, network.nativeCurrency.symbol)
          }));
        }
      }
    }

    poll();
    const timer = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [provider, network]);

  return status;
}
