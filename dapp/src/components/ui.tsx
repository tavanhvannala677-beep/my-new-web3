import { useState, type ReactNode } from "react";
import type { Status } from "../lib/format";
import { formatBatchStatusLao } from "../lib/format";
import { Check, Copy } from "lucide-react";

/**
 * Standard container card component with optional step counter and lock state.
 */
export function Card({
  title,
  step,
  locked,
  children
}: {
  title: ReactNode;
  step?: number;
  locked?: boolean;
  children: ReactNode;
}) {
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

/**
 * One-line status with an optional explorer link for blockchain transactions.
 */
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

export type BadgeVariant = "success" | "warning" | "info" | "danger" | "neutral";

/**
 * Accessible pill badge component for tags, verification states, and metadata flags.
 */
export function Badge({
  variant = "neutral",
  icon,
  children,
  className = ""
}: {
  variant?: BadgeVariant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`ui-badge ui-badge-${variant} ${className}`}>
      {icon && <span className="ui-badge-icon">{icon}</span>}
      {children}
    </span>
  );
}

/**
 * Interactive copy-to-clipboard button with visual feedback and icon toggle.
 */
export function CopyButton({
  text,
  label = "Copy",
  title = "Copy to clipboard",
  className = ""
}: {
  text: string;
  label?: string;
  title?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is not available
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={title}
      aria-label={copied ? "Copied to clipboard" : title}
      className={`ui-copy-btn ${copied ? "copied" : ""} ${className}`}
    >
      {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
      <span>{copied ? "Copied!" : label}</span>
    </button>
  );
}

/**
 * Semantic status badge mapping internal LaoTrace batch statuses to styled badges with Lao translations.
 */
export function StatusBadge({ status }: { status: string }) {
  let variant: BadgeVariant = "neutral";
  const s = status.toLowerCase();

  if (s.includes("clear") || s.includes("pass") || s.includes("verified") || s.includes("ok")) {
    variant = "success";
  } else if (s.includes("transit") || s.includes("process")) {
    variant = "info";
  } else if (s.includes("pending") || s.includes("reg")) {
    variant = "warning";
  } else if (s.includes("reject") || s.includes("fail") || s.includes("err")) {
    variant = "danger";
  }

  return (
    <Badge variant={variant} className="status-badge">
      <span className="status-badge-dot" />
      <span>{formatBatchStatusLao(status)}</span>
    </Badge>
  );
}
