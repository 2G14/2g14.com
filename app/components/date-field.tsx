interface DateFieldProps {
  label: string;
  value: string;
  max: number;
  widthClass?: string;
  onInput: (value: string) => void;
}

export default function DateField({
  label,
  value,
  max,
  widthClass = 'w-14',
  onInput,
}: DateFieldProps) {
  return (
    <label class={`form-control ${widthClass}`}>
      <div class="label">
        <span class="label-text">{label}</span>
      </div>
      <input
        type="number"
        value={value}
        min={1}
        max={max}
        class="input-bordered input w-full"
        onInput={(e) => onInput((e.target as HTMLInputElement).value)}
      />
    </label>
  );
}
