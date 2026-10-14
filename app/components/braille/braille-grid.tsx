import type { BrailleEntry } from '#src/domain/braille/braille.js';

import BrailleCells from './braille-cells.js';

interface BrailleGridProps {
  /** null は仮名の無い段で、位置を揃えるための空きマスとして描く */
  entries: readonly (BrailleEntry | null)[];
  /** 1 行に並べる数に合わせた grid-cols-* クラス */
  columnsClass: string;
}

export default function BrailleGrid({ entries, columnsClass }: BrailleGridProps) {
  return (
    <ul class={`grid gap-2 ${columnsClass}`}>
      {entries.map((entry) =>
        entry === null ? (
          <li aria-hidden="true" />
        ) : (
          <li class="flex flex-col items-center gap-2 rounded-box bg-base-200 px-2 py-3">
            <BrailleCells cells={entry.cells} />
            <span class="text-center text-sm font-bold">{entry.label}</span>
          </li>
        ),
      )}
    </ul>
  );
}
