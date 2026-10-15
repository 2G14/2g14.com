import MorseSignals from '#app/components/morse/morse-signals.js';
import type { MorseEntry } from '#src/domain/morse/entry.js';

interface MorseGridProps {
  /** null は仮名の無い段で、5 段に並べたときだけ位置を揃えるための空きとして描く */
  entries: readonly (MorseEntry | null)[];
  /** 1 行に並べる数に合わせた grid-cols-* クラス */
  columnsClass: string;
}

export default function MorseGrid({ entries, columnsClass }: MorseGridProps) {
  return (
    <ul class={`grid gap-2 ${columnsClass}`}>
      {entries.map((entry) =>
        entry === null ? (
          <li class="hidden sm:block" aria-hidden="true" />
        ) : (
          <li class="flex flex-col items-center gap-3 rounded-box bg-base-200 px-2 py-3">
            <MorseSignals code={entry.code} />
            <span class="text-center text-sm font-bold">{entry.label}</span>
          </li>
        ),
      )}
    </ul>
  );
}
