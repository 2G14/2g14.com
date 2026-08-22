import type { Child } from 'hono/jsx';
import { useState } from 'hono/jsx';

import type { ConvertResult } from '#app/lib/convert-result.js';

interface ConverterLayoutProps {
  inputTitle: string;
  fields: Child;
  calendar: Child;
  reverseUrl: string;
  resultTitle: string;
  result: ConvertResult;
  placeholder: string;
}

export default function ConverterLayout({
  inputTitle,
  fields,
  calendar,
  reverseUrl,
  resultTitle,
  result,
  placeholder,
}: ConverterLayoutProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div class="grid grid-cols-1 items-start gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-6">
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">{inputTitle}</h2>
          <div class="mt-4 flex flex-wrap items-end gap-3">
            {fields}
            <button
              type="button"
              class="btn btn-square btn-ghost btn-sm"
              onClick={() => setCalendarOpen(!calendarOpen)}
              title="カレンダーで選択"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="h-5 w-5"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </button>
          </div>
          {calendarOpen && calendar}
        </div>
      </div>

      <div class="flex justify-center self-center">
        <a
          href={reverseUrl}
          class="btn btn-circle rotate-90 btn-outline btn-sm md:rotate-0"
          title="逆変換"
        >
          ⇄
        </a>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">{resultTitle}</h2>
          {result ? (
            'error' in result ? (
              <div role="alert" class="mt-2 alert alert-error">
                <span>{result.error}</span>
              </div>
            ) : (
              <p class="mt-4 text-center text-2xl font-bold">{result.text}</p>
            )
          ) : (
            <p class="mt-2 text-base-content/50">{placeholder}</p>
          )}
        </div>
      </div>
    </div>
  );
}
