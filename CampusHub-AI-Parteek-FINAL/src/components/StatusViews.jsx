import { WifiOff, RefreshCw, Search } from "lucide-react";

// Shown while community data is loading.
export function LoadingGrid({ count = 6 }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card skeleton" />
      ))}
    </div>
  );
}

// Shown when loading failed. onRetry runs the request again.
export function ErrorState({ message, onRetry }) {
  return (
    <div className="state" role="alert">
      <span className="state-icon state-icon--bad"><WifiOff size={26} /></span>
      <h3>That didn’t load</h3>
      <p>{message}</p>
      <button className="btn" onClick={onRetry}>
        <RefreshCw size={15} /> Try again
      </button>
    </div>
  );
}

export function EmptyState({ title, text, actionLabel, onAction }) {
  return (
    <div className="state">
      <span className="state-icon"><Search size={26} /></span>
      <h3>{title}</h3>
      <p>{text}</p>
      {actionLabel && (
        <button className="btn btn--soft" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
}
