import { ALL_DOTS, type Cell, cellToUnicode, dotsLabel } from '#src/domain/braille/cell.js';

interface BrailleCellsProps {
  cells: readonly Cell[];
  /** 点の直径などの大きさ */
  size?: 'sm' | 'lg';
  showDotNumbers?: boolean;
}

/** 点字のマスを読む面から見た配置で描く。点の並びは列ごと（左列 1・2・3、右列 4・5・6） */
export default function BrailleCells({
  cells,
  size = 'sm',
  showDotNumbers = false,
}: BrailleCellsProps) {
  const dotClass = size === 'lg' ? 'size-6 text-xs' : 'size-2.5';
  const label = cells.map((cell) => `${dotsLabel(cell)}の点`).join('、');

  return (
    <span class="inline-flex gap-1.5" role="img" aria-label={label}>
      {cells.map((cell) => (
        <span
          class={`grid grid-flow-col grid-cols-2 grid-rows-3 ${size === 'lg' ? 'gap-1.5' : 'gap-0.5'}`}
          title={cellToUnicode(cell)}
        >
          {ALL_DOTS.map((dot) => (
            <span
              class={`flex items-center justify-center rounded-full ${dotClass} ${
                cell.dots.includes(dot)
                  ? 'bg-base-content text-base-100'
                  : 'border border-base-content/20 text-base-content/40'
              }`}
            >
              {showDotNumbers && dot}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
