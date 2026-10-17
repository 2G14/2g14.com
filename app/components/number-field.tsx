import Field from '#app/components/field.js';

interface NumberFieldProps {
  label: string;
  value: number | null;
  min: number;
  max: number;
  widthClass: string;
  onInput: (value: number | null) => void;
}

export default function NumberField({
  label,
  value,
  min,
  max,
  widthClass,
  onInput,
}: NumberFieldProps) {
  return (
    <Field label={label} widthClass={widthClass}>
      <input
        type="number"
        inputmode="numeric"
        value={value === null ? '' : value}
        min={min}
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
