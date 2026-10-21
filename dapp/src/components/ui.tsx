import type { ReactNode } from "react";
import type { Status } from "../lib/format";

export function Card({ title, step, locked, children }: { title: ReactNode; step?: number; locked?: boolean; children: ReactNode }) {
  return (
    <section className={`card${locked ? " locked" : ""}`}>
      <h2>
        {step != null && <span className="step">{step}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

/** One-line status with an optional explorer link for the transaction. */
export function StatusLine({ status, explorer }: { status: Status; explorer: string }) {
  if (status.kind === "idle") return null;
  const cls = status.kind === "ok" ? "ok" : status.kind === "error" ? "err" : "";
  return (
    <p className={`status ${cls}`} role="status">
      {status.message}
      {status.txHash && explorer && (
        <a href={`${explorer}/tx/${status.txHash}`} target="_blank" rel="noopener noreferrer">
          View transaction
        </a>
      )}
    </p>
  );
}
