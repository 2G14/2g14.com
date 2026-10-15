import MorseSignals from '#app/components/morse/morse-signals.js';
import type { MorseEntry } from '#src/domain/morse/entry.js';

/**
 * 五十音の 5 段を揃えて並べる列数。列数を画面幅で切り替えると、目次のサイドバーが出る幅で表が狭くなり
 * 符号がカードからはみ出すため、表自体の幅（@container）で切り替える。
 * 幅は最も長い仮名の符号（ア・エ）がカードに収まる最小値から決めた
 */
export const KANA_COLUMNS_CLASS = 'grid-cols-2 @[39rem]:grid-cols-5';

interface MorseGridProps {
  /** null は仮名の無い段で、5 段に並べたときだけ位置を揃えるための空きとして描く */
  entries: readonly (MorseEntry | null)[];
  /** 1 行に並べる数に合わせた grid-cols-* クラス。表の幅で切り替える場合は @[幅]: を付ける */
  columnsClass: string;
}

export default function MorseGrid({ entries, columnsClass }: MorseGridProps) {
  return (
    <div class="@container">
      <ul class={`grid gap-2 ${columnsClass}`}>
        {entries.map((entry) =>
          entry === null ? (
            <li class="hidden @[39rem]:block" aria-hidden="true" />
          ) : (
            <li class="flex flex-col items-center gap-3 rounded-box bg-base-200 px-2 py-3">
              <MorseSignals code={entry.code} />
              <span class="text-center text-sm font-bold">{entry.label}</span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
