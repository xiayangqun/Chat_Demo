import { X } from 'lucide-react';

interface QuotePreviewProps {
  authorName: string;
  body: string;
  onClear: () => void;
}

const MAX_PREVIEW_LENGTH = 80;

export function QuotePreview({ authorName, body, onClear }: QuotePreviewProps) {
  const truncated =
    body.length > MAX_PREVIEW_LENGTH
      ? `${body.slice(0, MAX_PREVIEW_LENGTH)}...`
      : body;

  return (
    <div className="flex items-center gap-3 border-l-2 border-accent bg-dropdown px-3 py-2">
      <div className="min-w-0 flex-1">
        <span className="text-xs font-medium text-accent">{authorName}</span>
        <p className="truncate text-xs text-text-secondary">{truncated}</p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-border hover:text-text-primary"
        aria-label="Remove quote"
      >
        <X size={14} />
      </button>
    </div>
  );
}
