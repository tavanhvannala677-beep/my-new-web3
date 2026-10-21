import { useState, type FormEvent } from "react";
import type { Status } from "../lib/format";
import { Card, StatusLine } from "./ui";

interface Props {
  enabled: boolean;
  canWrite: boolean;
  status: Status;
  explorer: string;
  onStore(value: string): Promise<boolean>;
}

export function WriteCard({ enabled, canWrite, status, explorer, onStore }: Props) {
  const [input, setInput] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (await onStore(input)) setInput("");
  };

  return (
    <Card title="Write — store(uint256)" step={4} locked={!enabled}>
      <form className="row" onSubmit={submit}>
        <input
          type="number"
          min={0}
          step={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a number, e.g. 42"
          aria-label="Number to store"
        />
        <button type="submit" disabled={!canWrite || status.kind === "pending"}>
          Store on-chain
        </button>
      </form>
      {!canWrite && enabled && <p className="hint">Connect MetaMask on the right network to write.</p>}
      <StatusLine status={status} explorer={explorer} />
    </Card>
  );
}
