import type { NetworkConfig } from "../config/networks";
import { type NetworkStatus, getHealthBadgeLabel } from "../hooks/useNetworkStatus";
import { Badge, Card, type BadgeVariant } from "./ui";

export function NetworkCard({ network, status }: { network: NetworkConfig; status: NetworkStatus }) {
  const dot = status.online == null ? "dot" : status.online ? "dot on" : "dot off";
  const chainOk = status.liveChainId === network.chainId;
  const healthLabel = getHealthBadgeLabel(status.health);

  const badgeVariant: BadgeVariant =
    status.health === "optimal"
      ? "success"
      : status.health === "degraded"
      ? "warning"
      : status.health === "offline"
      ? "danger"
      : "neutral";

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
        <dt>Health & Latency</dt>
        <dd style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <Badge variant={badgeVariant}>{healthLabel.text}</Badge>
          {status.latencyMs != null && <span style={{ fontSize: "0.85em", color: "#64748b" }}>({status.latencyMs}ms)</span>}
        </dd>
        <dt>Latest block</dt>
        <dd>{status.online === false ? `RPC unreachable: ${status.error}` : status.blockNumber?.toLocaleString() ?? "—"}</dd>
        <dt>Gas price</dt>
        <dd>{status.gasPriceGwei ? `${status.gasPriceGwei} gwei` : "—"}</dd>
        {status.lastChecked && (
          <>
            <dt>Last checked</dt>
            <dd style={{ fontSize: "0.85em", color: "#64748b" }}>{status.lastChecked}</dd>
          </>
        )}
      </dl>
    </Card>
  );
}
