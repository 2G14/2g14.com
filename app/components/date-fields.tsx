import type { DateInputValues } from '#app/lib/date-input.js';
import { todayInJST } from '#src/lib/date.js';

import DateField from './date-field.js';

interface DateFieldsProps {
  value: DateInputValues;
  onChange: (value: DateInputValues) => void;
}

/** 年・月・日の入力欄と、今日の日付を入れるボタン */
export default function DateFields({ value, onChange }: DateFieldsProps) {
  return (
    <div class="flex flex-wrap items-end gap-3">
      <DateField
        label="年"
        value={value.year}
        max={9999}
        widthClass="w-20"
        onInput={(year) => onChange({ ...value, year })}
      />
      <DateField
        label="月"
        value={value.month}
        max={12}
        widthClass="w-14"
        onInput={(month) => onChange({ ...value, month })}
      />
      <DateField
        label="日"
        value={value.day}
        max={31}
        widthClass="w-14"
        onInput={(day) => onChange({ ...value, day })}
      />
      <button type="button" class="btn btn-ghost btn-sm" onClick={() => onChange(todayInJST())}>
        今日
      </button>
    </div>
  );
}
