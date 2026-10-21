import type { NetworkConfig } from "../config/networks";
import type { Wallet } from "../hooks/useWallet";
import { Card, StatusLine } from "./ui";

const isMobile = () => /Android|iPhone|iPad/i.test(navigator.userAgent);

export function WalletCard({ network, wallet, explorer }: { network: NetworkConfig; wallet: Wallet; explorer: string }) {
  const mobileDeepLink =
    !wallet.hasWallet && isMobile() && window.location.protocol.startsWith("http")
      ? `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}${window.location.search}`
      : null;

  return (
    <Card title="Connect wallet" step={1}>
      <div className="row">
        <button onClick={wallet.connect} disabled={!!wallet.account && wallet.onRightNetwork}>
          {wallet.account ? "Connected" : "Connect MetaMask"}
        </button>
        {mobileDeepLink && <a href={mobileDeepLink}>Open in the MetaMask app</a>}
      </div>

      {wallet.account && (
        <dl className="kv" style={{ marginTop: 12 }}>
          <dt>Account</dt>
          <dd className="mono">{wallet.account}</dd>
          <dt>Balance</dt>
          <dd>{wallet.balance ?? "—"}</dd>
          <dt>Wallet network</dt>
          <dd>{wallet.onRightNetwork ? `${network.chainName} (${wallet.walletChainId}) ✓` : `Chain ID ${wallet.walletChainId ?? "?"}`}</dd>
        </dl>
      )}

      {wallet.account && !wallet.onRightNetwork && (
        <div className="banner warn" style={{ marginTop: 12 }}>
          MetaMask is on another network.{" "}
          <button className="small" onClick={wallet.switchNetwork}>
            Switch to {network.chainName}
          </button>
        </div>
      )}

      <StatusLine status={wallet.status} explorer={explorer} />
    </Card>
  );
}
