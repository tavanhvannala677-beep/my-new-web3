import type { NetworkConfig } from "../config/networks";
import type { NetworkStatus } from "../hooks/useNetworkStatus";
import { Card } from "./ui";

export function NetworkCard({ network, status }: { network: NetworkConfig; status: NetworkStatus }) {
  const dot = status.online == null ? "dot" : status.online ? "dot on" : "dot off";
  const chainOk = status.liveChainId === network.chainId;

  return (
    <Card title={<><span className={dot} />Network</>}>
      <dl className="kv">
        <dt>Network</dt>
        <dd>{network.chainName}</dd>
        <dt>Chain ID</dt>
        <dd>
          {status.liveChainId == null ? "—" : chainOk ? `${status.liveChainId} ✓` : `${status.liveChainId} (expected ${network.chainId})`}
        </dd>
        <dt>RPC</dt>
        <dd className="mono">{network.rpcUrls[0]}</dd>
        <dt>Latest block</dt>
        <dd>{status.online === false ? `RPC unreachable: ${status.error}` : status.blockNumber?.toLocaleString() ?? "—"}</dd>
        <dt>Gas price</dt>
        <dd>{status.gasPriceGwei ? `${status.gasPriceGwei} gwei` : "—"}</dd>
      </dl>
    </Card>
  );
}
