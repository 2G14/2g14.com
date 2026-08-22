import Field from './field.js';

interface DateFieldProps {
  label: string;
  value: number | null;
  max: number;
  widthClass: string;
  onInput: (value: number | null) => void;
}

export default function DateField({ label, value, max, widthClass, onInput }: DateFieldProps) {
  return (
    <Field label={label} widthClass={widthClass}>
      <input
        type="number"
        value={value === null ? '' : value}
        min={1}
        max={max}
        class="input-bordered input w-full"
        onInput={(e) => {
          const raw = (e.target as HTMLInputElement).value;
          const parsed = Number(raw);
          onInput(raw === '' || Number.isNaN(parsed) ? null : parsed);
        }}
      />
    </Field>
  );
}
