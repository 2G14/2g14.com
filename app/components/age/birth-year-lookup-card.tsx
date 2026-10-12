import type { Child } from 'hono/jsx';

import type { NoResult } from '#app/lib/result.js';

import DateField from '../date-field.js';

interface BirthYearLookupCardProps<T> {
  title: string;
  emptyMessage: string;
  year: number | null;
  onYearInput: (year: number | null) => void;
  result: NoResult | T;
  renderResult: (result: T) => Child;
}

export default function BirthYearLookupCard<T extends { kind: 'ok' }>({
  title,
  emptyMessage,
  year,
  onYearInput,
  result,
  renderResult,
}: BirthYearLookupCardProps<T>) {
  return (
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <h2 class="card-title">{title}</h2>
        <div class="mt-2 flex items-end gap-3">
          <DateField
            label="生まれ年（西暦）"
            value={year}
            max={9999}
            widthClass="w-32"
            onInput={onYearInput}
          />
        </div>
        {result.kind === 'empty' ? (
          <p class="mt-2 text-base-content/50">{emptyMessage}</p>
        ) : result.kind === 'error' ? (
          <div role="alert" class="mt-2 alert alert-error">
            <span>{result.message}</span>
          </div>
        ) : (
          <div class="mt-2">{renderResult(result)}</div>
        )}
      </div>
    </div>
  );
}
