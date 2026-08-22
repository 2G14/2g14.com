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
  displayLabel = String(value),
  onYearInput,
}: EditableYearProps) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <button
        type="button"
        class="btn btn-ghost text-base btn-sm"
        onClick={() => setEditing(true)}
        title="年を直接入力"
      >
        {displayLabel}年
      </button>
    );
  }

  return (
    <input
      type="number"
      class={`input-bordered input ${widthClass} text-center input-sm`}
      value={value}
      min={min}
      onInput={(e) => {
        const v = Number((e.target as HTMLInputElement).value);
        if (Number.isInteger(v) && v >= min) onYearInput(v);
      }}
      onBlur={() => setEditing(false)}
      onKeyDown={(e) => {
        if ((e as KeyboardEvent).key === 'Enter') setEditing(false);
      }}
      autoFocus
    />
  );
}
