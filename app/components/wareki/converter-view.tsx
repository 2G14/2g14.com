import type { Child } from 'hono/jsx';
import { useState } from 'hono/jsx';

import CalendarToggleButton from '#app/components/calendar-toggle-button.js';
import type { ConvertResult } from '#app/lib/wareki/convert-result.js';

interface ConverterViewProps {
  inputTitle: string;
  fields: Child;
  calendar: Child;
  reverseUrl: string;
  resultTitle: string;
  result: ConvertResult;
  placeholder: string;
}

export default function ConverterView({
  inputTitle,
  fields,
  calendar,
  reverseUrl,
  resultTitle,
  result,
  placeholder,
}: ConverterViewProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div class="grid grid-cols-1 items-start gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-6">
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">{inputTitle}</h2>
          <div class="mt-4 flex flex-wrap items-end gap-3">
            {fields}
            <CalendarToggleButton onClick={() => setCalendarOpen(!calendarOpen)} />
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
          {result.kind === 'ok' ? (
            <p class="mt-4 text-center text-2xl font-bold">{result.text}</p>
          ) : result.kind === 'error' ? (
            <div role="alert" class="mt-2 alert alert-error">
              <span>{result.message}</span>
            </div>
          ) : (
            <p class="mt-2 text-base-content/50">{placeholder}</p>
          )}
        </div>
      </div>
    </div>
  );
}
