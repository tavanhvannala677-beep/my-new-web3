import { BrowserProvider, formatEther, getAddress, type JsonRpcProvider, type JsonRpcSigner } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { addChainParams, toHexChainId, type NetworkConfig } from "../config/networks";
import { errorMessage } from "../lib/errors";
import { IDLE, type Status } from "../lib/format";

export interface Wallet {
  hasWallet: boolean;
  account: string | null;
  walletChainId: number | null;
  onRightNetwork: boolean;
  balance: string | null;
  status: Status;
  connect(): Promise<void>;
  switchNetwork(): Promise<void>;
  getSigner(): Promise<JsonRpcSigner>;
  refreshBalance(): Promise<void>;
}

/** Errors MetaMask uses for "this chain is not added yet" (mobile builds nest the code). */
function isUnknownChain(err: unknown): boolean {
  const e = err as { code?: number; data?: { originalError?: { code?: number } } };
  const code = e?.code ?? e?.data?.originalError?.code;
  return code === 4902 || code === -32603;
}

/** MetaMask connection: account, network, balance and the actions that change them. */
export function useWallet(network: NetworkConfig, readProvider: JsonRpcProvider): Wallet {
  const ethereum = typeof window !== "undefined" ? window.ethereum : undefined;
  const [account, setAccount] = useState<string | null>(null);
  const [walletChainId, setWalletChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(IDLE);
  const symbol = network.nativeCurrency.symbol;

  const readChainId = useCallback(async () => {
    if (!ethereum) return;
    setWalletChainId(Number(await ethereum.request({ method: "eth_chainId" })));
  }, [ethereum]);

  const refreshBalance = useCallback(async () => {
    if (!account) return setBalance(null);
    try {
      setBalance(`${formatEther(await readProvider.getBalance(account))} ${symbol}`);
    } catch {
      setBalance(null);
    }
  }, [account, readProvider, symbol]);

  const switchNetwork = useCallback(async () => {
    if (!ethereum) return;
    try {
      await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: toHexChainId(network.chainId) }] });
    } catch (err) {
      if (!isUnknownChain(err)) throw err;
      await ethereum.request({ method: "wallet_addEthereumChain", params: [addChainParams(network)] });
    }
    await readChainId();
  }, [ethereum, network, readChainId]);

  const connect = useCallback(async () => {
    if (!ethereum) {
      setStatus({ kind: "error", message: "MetaMask not found. Install it from metamask.io (desktop) or open this page inside the MetaMask app (mobile)." });
      return;
    }
    try {
      setStatus({ kind: "pending", message: "Waiting for MetaMask…" });
      const accounts = (await ethereum.request({ method: "eth_requestAccounts" })) as string[];
      setAccount(getAddress(accounts[0]));
      await switchNetwork();
      setStatus({ kind: "ok", message: "Wallet connected." });
    } catch (err) {
      setStatus({ kind: "error", message: errorMessage(err, symbol) });
      await readChainId().catch(() => {});
    }
  }, [ethereum, switchNetwork, readChainId, symbol]);

  const getSigner = useCallback(async () => {
    if (!ethereum) throw new Error("MetaMask not found");
    return new BrowserProvider(ethereum).getSigner();
  }, [ethereum]);

  // Reconnect silently if this site is already authorised, and follow MetaMask changes
  useEffect(() => {
    if (!ethereum) return;
    ethereum
      .request({ method: "eth_accounts" })
      .then(async (accounts) => {
        const list = accounts as string[];
        if (list.length) {
          setAccount(getAddress(list[0]));
          await readChainId();
        }
      })
      .catch(() => {});

    const onAccounts = (accounts: string[]) => setAccount(accounts.length ? getAddress(accounts[0]) : null);
    const onChain = (chainId: string) => setWalletChainId(Number(chainId));
    ethereum.on?.("accountsChanged", onAccounts);
    ethereum.on?.("chainChanged", onChain);
    return () => {
      ethereum.removeListener?.("accountsChanged", onAccounts);
      ethereum.removeListener?.("chainChanged", onChain);
    };
  }, [ethereum, readChainId]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance, walletChainId]);

  return {
    hasWallet: !!ethereum,
    account,
    walletChainId,
    onRightNetwork: walletChainId === network.chainId,
    balance,
    status,
    connect,
    switchNetwork: () => switchNetwork().catch((err) => setStatus({ kind: "error", message: errorMessage(err, symbol) })),
    getSigner,
    refreshBalance
  };
}
