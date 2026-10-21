import { formatUnits, type JsonRpcProvider } from "ethers";
import { useEffect, useState } from "react";
import type { NetworkConfig } from "../config/networks";
import { errorMessage } from "../lib/errors";

export interface NetworkStatus {
  online: boolean | null;
  liveChainId: number | null;
  blockNumber: number | null;
  gasPriceGwei: string | null;
  error: string | null;
}

const POLL_MS = 6000;

/** Polls the public RPC: proves the page is talking to the real chain, no wallet needed. */
export function useNetworkStatus(network: NetworkConfig, provider: JsonRpcProvider): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    online: null, liveChainId: null, blockNumber: null, gasPriceGwei: null, error: null
  });

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const [chainHex, blockNumber, fee] = await Promise.all([
          provider.send("eth_chainId", []) as Promise<string>,
          provider.getBlockNumber(),
          provider.getFeeData()
        ]);
        if (cancelled) return;
        setStatus({
          online: true,
          liveChainId: Number(chainHex),
          blockNumber,
          gasPriceGwei: fee.gasPrice != null ? formatUnits(fee.gasPrice, "gwei") : null,
          error: null
        });
      } catch (err) {
        if (!cancelled) setStatus((s) => ({ ...s, online: false, error: errorMessage(err, network.nativeCurrency.symbol) }));
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
