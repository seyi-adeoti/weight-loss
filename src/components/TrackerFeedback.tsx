export default function TrackerFeedback({
  error,
  loading,
  onRetry,
}: {
  error: string;
  loading: boolean;
  onRetry: () => void;
}) {
  if (error)
    return (
      <div
        className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900"
        role="alert"
      >
        <p>{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 min-h-11 font-bold underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    );
  if (loading)
    return (
      <div
        role="status"
        className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6"
      >
        <p className="text-slate-600">Loading your saved entries…</p>
        <div className="mt-4 h-16 rounded-xl bg-slate-100" />
      </div>
    );
  return null;
}
