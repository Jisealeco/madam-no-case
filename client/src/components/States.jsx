import { AlertCircle, Sparkles } from 'lucide-react';

export function CardSkeletons({ count = 3, className = 'aspect-[4/5]' }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className={`animate-pulse rounded-[1.4rem] bg-ivory-200/70 ${className}`} aria-hidden="true" />
  ));
}

export function EmptyState({ title, children }) {
  return (
    <div className="col-span-full mx-auto max-w-md rounded-3xl border border-dashed border-gold-500/40 bg-white/60 px-8 py-12 text-center">
      <Sparkles className="mx-auto h-7 w-7 text-gold-500" />
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      {children && <div className="mt-2 text-muted">{children}</div>}
    </div>
  );
}

export function ErrorNotice({ error, onRetry }) {
  return (
    <div role="alert" className="col-span-full mx-auto flex max-w-lg items-start gap-3 rounded-2xl bg-wine-50 px-5 py-4 text-wine-700 ring-1 ring-wine-600/15">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="text-[0.95rem]">
        <p>{error?.message || 'Something went wrong while loading this section.'}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="mt-1 font-medium underline underline-offset-4">
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
