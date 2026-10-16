import { useEffect, useState } from 'hono/jsx';

import SumTable from '#app/components/dice/sum-table.js';
import Field from '#app/components/field.js';
import { diceQueryString, initialDiceSet } from '#app/lib/dice/dice-query.js';
import { formatFraction, formatPercent } from '#app/lib/dice/format.js';
import { replaceUrlQuery } from '#app/lib/url.js';
import {
  createDiceSet,
  DICE_FACES,
  MAX_DICE_COUNT,
  totalOutcomes,
} from '#src/domain/dice/dice-set.js';
import {
  allSameWays,
  atLeastOneWays,
  expectedSum,
  sumDistribution,
} from '#src/domain/dice/probability.js';

const COUNTS = Array.from({ length: MAX_DICE_COUNT }, (_, i) => i + 1);

interface Props {
  initialCount?: string | undefined;
  initialFaces?: string | undefined;
}

export default function DiceSumCalculator({ initialCount, initialFaces }: Props) {
  const [dice, setDice] = useState(initialDiceSet(initialCount, initialFaces));

  useEffect(() => {
    replaceUrlQuery(diceQueryString(dice));
  }, [dice]);

  const rows = sumDistribution(dice);
  const total = totalOutcomes(dice);
  const maxWays = Math.max(...rows.map((row) => row.ways));
  const modes = rows.filter((row) => row.ways === maxWays);
  const notation = `${dice.count}D${dice.faces}`;

  const probability = (ways: number) =>
    `${formatPercent(ways, total)}（${formatFraction(ways, total)}）`;

  return (
    <div class="grid grid-cols-1 gap-6">
      <div class="grid grid-cols-1 items-start gap-3 md:grid-cols-2 md:gap-6">
        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">サイコロ</h2>
            <div class="flex flex-wrap gap-4">
              <Field label="面数" widthClass="w-28">
                <select
                  class="select-bordered select w-full"
                  onChange={(e) => {
                    setDice(
                      createDiceSet(dice.count, Number((e.target as HTMLSelectElement).value)),
                    );
                  }}
                >
                  {DICE_FACES.map((faces) => (
                    <option value={faces} selected={faces === dice.faces}>
                      {faces} 面
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="個数" widthClass="w-28">
                <select
                  class="select-bordered select w-full"
                  onChange={(e) => {
                    setDice(
                      createDiceSet(Number((e.target as HTMLSelectElement).value), dice.faces),
                    );
                  }}
                >
                  {COUNTS.map((count) => (
                    <option value={count} selected={count === dice.count}>
                      {count} 個
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <p class="text-sm text-base-content/60">
              {dice.faces} 面サイコロを {dice.count} 個振ったとき（{notation}
              ）の出目の合計の確率です。
            </p>
          </div>
        </div>

        <div class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">{notation} のまとめ</h2>
            <ul class="list-inside list-disc text-sm">
              <li>
                合計の範囲：{dice.count}〜{dice.count * dice.faces}
              </li>
              <li>合計の平均（期待値）：{expectedSum(dice)}</li>
              <li>
                最も出やすい合計：{modes.map((row) => row.sum).join('・')}（
                {modes.length > 1 && 'それぞれ '}
                {probability(maxWays)}）
              </li>
              <li>出目の組み合わせ：{total.toLocaleString()} 通り</li>
              {dice.count >= 2 && <li>全部同じ目（ゾロ目）：{probability(allSameWays(dice))}</li>}
              <li>
                特定の目（たとえば {dice.faces} の目）が 1 個以上出る：
                {probability(atLeastOneWays(dice))}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body p-0 sm:p-2">
          <h2 class="card-title px-4 pt-4">{notation} の合計の確率</h2>
          <SumTable caption={`${notation} の出目の合計の確率`} rows={rows} total={total} />
        </div>
      </div>
    </div>
  );
}
