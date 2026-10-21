import { useEffect, useState, type FormEvent } from "react";
import type { Status } from "../lib/format";
import { Card, StatusLine } from "./ui";

interface Props {
  address: string | null;
  status: Status;
  explorer: string;
  canDeploy: boolean;
  onLoad(address: string): void;
  onDeploy(): void;
}

export function ContractCard({ address, status, explorer, canDeploy, onLoad, onDeploy }: Props) {
  const [input, setInput] = useState(address ?? "");

  // Keep the box in sync when an address is restored or a new contract is deployed
  useEffect(() => {
    if (address) setInput(address);
  }, [address]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onLoad(input);
  };

  return (
    <Card title="Contract" step={2}>
      <p style={{ marginBottom: 10 }}>Paste the SimpleStorage address you deployed in Remix, or deploy a fresh one from this page.</p>
      <form className="row" onSubmit={submit}>
        <input
          className="mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="0x… contract address"
          spellCheck={false}
          autoComplete="off"
          aria-label="Contract address"
        />
        <button type="submit" className="ghost">
          Load
        </button>
      </form>
      <div className="row" style={{ marginTop: 10 }}>
        <button onClick={onDeploy} disabled={!canDeploy || status.kind === "pending"}>
          Deploy a new SimpleStorage
        </button>
        {address && explorer && (
          <a href={`${explorer}/address/${address}`} target="_blank" rel="noopener noreferrer">
            View contract in explorer
          </a>
        )}
      </div>
      <StatusLine status={status} explorer={explorer} />
    </Card>
  );
}
