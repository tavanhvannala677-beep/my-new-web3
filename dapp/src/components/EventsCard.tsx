import type { NumberChange } from "../hooks/useSimpleStorage";
import { shortHex } from "../lib/format";
import { Card } from "./ui";

export function EventsCard({ enabled, events, explorer }: { enabled: boolean; events: NumberChange[]; explorer: string }) {
  return (
    <Card title="Recent activity — NumberChanged events" locked={!enabled}>
      <ul className="list">
        {events.length === 0 && <li className="meta">No events yet.</li>}
        {events.map((e) => (
          <li key={e.txHash}>
            {/* Rendered as text by React — on-chain data is never injected as HTML */}
            <div>
              {shortHex(e.by)} stored {e.newNumber}
            </div>
            <div className="meta">
              block {e.blockNumber} ·{" "}
              {explorer ? (
                <a href={`${explorer}/tx/${e.txHash}`} target="_blank" rel="noopener noreferrer">
                  {shortHex(e.txHash)}
                </a>
              ) : (
                shortHex(e.txHash)
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
