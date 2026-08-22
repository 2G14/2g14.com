import Field from './field.js';

interface DateFieldProps {
  label: string;
  value: string;
  max: number;
  widthClass: string;
  onInput: (value: string) => void;
}

export default function DateField({ label, value, max, widthClass, onInput }: DateFieldProps) {
  return (
    <Field label={label} widthClass={widthClass}>
      <input
        type="number"
        value={value}
        min={1}
        max={max}
        class="input-bordered input w-full"
        onInput={(e) => onInput((e.target as HTMLInputElement).value)}
      />
    </Field>
  );
}
