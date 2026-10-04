import type { Child } from 'hono/jsx';

interface FieldProps {
  label: string;
  widthClass: string;
  children: Child;
}

export default function Field({ label, widthClass, children }: FieldProps) {
  return (
    <label class={`form-control ${widthClass}`}>
      <div class="label">
        <span class="label-text">{label}</span>
      </div>
      {children}
    </label>
  );
}
