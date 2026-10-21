import { Card } from "./ui";

interface Props {
  enabled: boolean;
  value: string | null;
  lastUpdatedBy: string | null;
  onRefresh(): void;
}

export function ReadCard({ enabled, value, lastUpdatedBy, onRefresh }: Props) {
  return (
    <Card title="Read — retrieve()" step={3} locked={!enabled}>
      <div className="big" data-testid="value">{value ?? "—"}</div>
      <p className="mono">{value == null ? "" : lastUpdatedBy ? `Last updated by: ${lastUpdatedBy}` : "Never updated yet."}</p>
      <button className="ghost" style={{ marginTop: 10 }} onClick={onRefresh}>
        Refresh
      </button>
    </Card>
  );
}
