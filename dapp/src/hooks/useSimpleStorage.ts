import { getAddress, isAddress, ZeroAddress, type ContractEventPayload, type JsonRpcProvider, type JsonRpcSigner } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { simpleStorageAt, simpleStorageFactory } from "../contracts/simpleStorage";
import type { NetworkConfig } from "../config/networks";
import { errorMessage } from "../lib/errors";
import { IDLE, isUint, type Status } from "../lib/format";

export interface NumberChange {
  by: string;
  newNumber: string;
  txHash: string;
  blockNumber: number;
}

const RECENT_BLOCKS = 5000;
const MAX_EVENTS = 10;

const storageKey = (network: NetworkConfig) => `simple-storage-address:${network.key}`;

function initialAddress(network: NetworkConfig): string | null {
  const fromUrl = new URLSearchParams(window.location.search).get("address");
  if (fromUrl) return fromUrl;
  try {
    return localStorage.getItem(storageKey(network));
  } catch {
    return null;
  }
}

function rememberAddress(network: NetworkConfig, address: string) {
  try {
    localStorage.setItem(storageKey(network), address);
  } catch {
    /* private mode: the URL still keeps it */
  }
  const url = new URL(window.location.href);
  url.searchParams.set("address", address);
  window.history.replaceState(null, "", url);
}

/** Everything the UI needs for one SimpleStorage contract: load, read, write, deploy, events. */
export function useSimpleStorage(network: NetworkConfig, readProvider: JsonRpcProvider) {
  const symbol = network.nativeCurrency.symbol;
  const [address, setAddress] = useState<string | null>(null);
  const [value, setValue] = useState<string | null>(null);
  const [lastUpdatedBy, setLastUpdatedBy] = useState<string | null>(null);
  const [events, setEvents] = useState<NumberChange[]>([]);
  const [contractStatus, setContractStatus] = useState<Status>(IDLE);
  const [writeStatus, setWriteStatus] = useState<Status>(IDLE);

  const refresh = useCallback(async () => {
    if (!address) return;
    const contract = simpleStorageAt(address, readProvider);
    const [v, by] = await Promise.all([contract.retrieve() as Promise<bigint>, contract.lastUpdatedBy() as Promise<string>]);
    setValue(v.toString());
    setLastUpdatedBy(by === ZeroAddress ? null : by);
  }, [address, readProvider]);

  /** Validate an address on-chain, then make it the active contract. */
  const load = useCallback(
    async (input: string) => {
      const raw = input.trim();
      if (!isAddress(raw)) return setContractStatus({ kind: "error", message: "That is not a valid address." });
      const addr = getAddress(raw);
      setContractStatus({ kind: "pending", message: `Checking the address on ${network.chainName}…` });
      try {
        if ((await readProvider.getCode(addr)) === "0x") {
          return setContractStatus({
            kind: "error",
            message: `No contract found at this address on ${network.chainName}. Did you deploy to another network?`
          });
        }
        rememberAddress(network, addr);
        setEvents([]);
        setAddress(addr);
        setContractStatus({ kind: "ok", message: "Contract loaded." });
      } catch (err) {
        setContractStatus({ kind: "error", message: errorMessage(err, symbol) });
      }
    },
    [network, readProvider, symbol]
  );

  const deploy = useCallback(
    async (signer: JsonRpcSigner) => {
      try {
        setContractStatus({ kind: "pending", message: "Confirm the deployment in MetaMask…" });
        const contract = await simpleStorageFactory(signer).deploy();
        const txHash = contract.deploymentTransaction()?.hash;
        setContractStatus({ kind: "pending", message: "Deploying — waiting for the block (~12 s)…", txHash });
        await contract.waitForDeployment();
        await load(await contract.getAddress());
        setContractStatus({ kind: "ok", message: "Deployed and loaded!", txHash });
      } catch (err) {
        setContractStatus({ kind: "error", message: errorMessage(err, symbol) });
      }
    },
    [load, symbol]
  );

  const store = useCallback(
    async (signer: JsonRpcSigner, input: string): Promise<boolean> => {
      if (!address) return false;
      if (!isUint(input)) {
        setWriteStatus({ kind: "error", message: "Enter a whole number (0 or more)." });
        return false;
      }
      try {
        setWriteStatus({ kind: "pending", message: "Confirm the transaction in MetaMask…" });
        const tx = await simpleStorageAt(address, signer).store(BigInt(input.trim()));
        setWriteStatus({ kind: "pending", message: "Sent — waiting for the block (~12 s)…", txHash: tx.hash });
        await tx.wait();
        setWriteStatus({ kind: "ok", message: `Stored ${input.trim()} on ${network.chainName}!`, txHash: tx.hash });
        await refresh();
        return true;
      } catch (err) {
        setWriteStatus({ kind: "error", message: errorMessage(err, symbol) });
        return false;
      }
    },
    [address, network, refresh, symbol]
  );

  const addEvent = useCallback((change: NumberChange) => {
    setEvents((list) =>
      list.some((e) => e.txHash === change.txHash)
        ? list
        : [change, ...list].sort((a, b) => b.blockNumber - a.blockNumber).slice(0, MAX_EVENTS)
    );
  }, []);

  // Restore the last contract (URL first, then localStorage)
  useEffect(() => {
    const saved = initialAddress(network);
    if (saved) load(saved);
  }, [network, load]);

  // Read the value, load recent history and subscribe to live NumberChanged events
  useEffect(() => {
    if (!address) return;
    const contract = simpleStorageAt(address, readProvider);
    refresh().catch((err) => setContractStatus({ kind: "error", message: errorMessage(err, symbol) }));

    (async () => {
      try {
        const latest = await readProvider.getBlockNumber();
        const logs = await contract.queryFilter("NumberChanged", Math.max(0, latest - RECENT_BLOCKS), latest);
        for (const log of logs) {
          if ("args" in log) {
            addEvent({ by: log.args[0], newNumber: log.args[1].toString(), txHash: log.transactionHash, blockNumber: log.blockNumber });
          }
        }
      } catch {
        /* some RPCs limit log ranges; live events still work */
      }
    })();

    const onChange = (by: string, newNumber: bigint, payload: ContractEventPayload) => {
      addEvent({ by, newNumber: newNumber.toString(), txHash: payload.log.transactionHash, blockNumber: payload.log.blockNumber });
      refresh().catch(() => {});
    };
    contract.on("NumberChanged", onChange);
    return () => {
      contract.off("NumberChanged", onChange);
    };
  }, [address, readProvider, refresh, addEvent, symbol]);

  return { address, value, lastUpdatedBy, events, contractStatus, writeStatus, load, deploy, store, refresh };
}
