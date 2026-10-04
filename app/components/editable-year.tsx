import { useState } from 'hono/jsx';

interface EditableYearProps {
  value: number;
  min: number;
  widthClass: string;
  displayLabel?: string;
  onYearInput: (year: number) => void;
}

export default function EditableYear({
  value,
  min,
  widthClass,
  displayLabel = `${value}年`,
  onYearInput,
}: EditableYearProps) {
  const [draft, setDraft] = useState<string | null>(null);

  if (draft === null) {
    return (
      <button
        type="button"
        class="btn btn-ghost text-base btn-sm"
        onClick={() => setDraft(String(value))}
        title="年を直接入力"
      >
        {displayLabel}
      </button>
    );
  }

  return (
    <input
      type="number"
      class={`input-bordered input ${widthClass} text-center input-sm`}
      value={draft}
      min={min}
      onInput={(e) => {
        const raw = (e.target as HTMLInputElement).value;
        setDraft(raw);
        const year = Number(raw);
        if (Number.isInteger(year) && year >= min) onYearInput(year);
      }}
      onBlur={() => setDraft(null)}
      onKeyDown={(e) => {
        if ((e as KeyboardEvent).key === 'Enter') setDraft(null);
      }}
      autoFocus
    />
  );
}
