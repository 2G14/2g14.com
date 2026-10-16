import { useEffect, useState } from 'hono/jsx';

import DistributionChart from '#app/components/dice/distribution-chart.js';
import ProbabilityGauge from '#app/components/dice/probability-gauge.js';
import StatTile from '#app/components/dice/stat-tile.js';
import NumberField from '#app/components/number-field.js';
import TocSection from '#app/components/toc-section.js';
import { parseDiceInput } from '#app/lib/dice/dice-input.js';
import { diceQueryString, initialDiceInput } from '#app/lib/dice/dice-query.js';
import { formatFraction, formatPercent, formatWays } from '#app/lib/dice/format.js';
import { DICE_SECTIONS } from '#app/lib/dice/sections.js';
import { replaceUrlQuery } from '#app/lib/url.js';
import {
  type DiceSet,
  MAX_DICE_COUNT,
  MAX_FACES,
  MIN_FACES,
  totalOutcomes,
} from '#src/domain/dice/dice-set.js';
import {
  allSameWays,
  expectedSum,
  faceCountDistribution,
  sumDistribution,
} from '#src/domain/dice/probability.js';

/**
 * サーバーで描画する合計の種類数の上限。100 面 100 個（9,901 種類）を描画すると、Workers の
 * リクエストあたりの CPU 時間の制限を超えるおそれがあるため、大きな組はブラウザでだけ計算する
 */
const SERVER_RENDER_MAX_SUMS = 200;

interface Props {
  initialFaces?: string | undefined;
  initialCount?: string | undefined;
}

interface DiceResultProps {
  dice: DiceSet;
}

function DiceResult({ dice }: DiceResultProps) {
  const rows = sumDistribution(dice);
  const faceCounts = faceCountDistribution(dice);
  const total = totalOutcomes(dice);
  const maxWays = rows.reduce((max, row) => (row.ways > max ? row.ways : max), 0n);
  const modes = rows.filter((row) => row.ways === maxWays).map((row) => row.sum);
  const modeFraction = formatFraction(maxWays, total);
  const atLeastOne = faceCounts[1]?.atLeastWays;

  return (
    <>
      <TocSection item={DICE_SECTIONS.summary}>
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile title="合計の範囲" value={`${dice.count}〜${dice.count * dice.faces}`} />
          <StatTile title="合計の平均（期待値）" value={expectedSum(dice)} />
          <StatTile
            title="最も出やすい合計"
            value={modes.join('・')}
            description={`${modes.length > 1 ? 'それぞれ ' : ''}${formatPercent(maxWays, total)}${modeFraction === null ? '' : `（${modeFraction}）`}`}
          />
          <StatTile title="出目の組み合わせ" value={formatWays(total)} description="通り" />
        </div>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          {dice.count >= 2 && (
            <ProbabilityGauge
              title="全部同じ目（ゾロ目）"
              description={`${dice.count} 個とも同じ目`}
              ways={allSameWays(dice)}
              total={total}
            />
          )}
          {atLeastOne !== undefined && (
            <ProbabilityGauge
              title="特定の目が 1 個以上出る"
              description={`たとえば ${dice.faces} の目`}
              ways={atLeastOne}
              total={total}
            />
          )}
        </div>
      </TocSection>

      <TocSection item={DICE_SECTIONS.sum}>
        <DistributionChart
          points={rows.map(({ sum, ways, atLeastWays, atMostWays }) => ({
            x: sum,
            ways,
            atLeastWays,
            atMostWays,
          }))}
          total={total}
          xName="合計"
          xUnit=""
          modeLabels={{ exact: 'その数', atLeast: 'その数以上', atMost: 'その数以下' }}
        />
      </TocSection>

      <TocSection item={DICE_SECTIONS.faceCount}>
        <p class="text-sm text-base-content/70">
          {`${dice.count} 個のうち、特定の目（たとえば ${dice.faces} の目）が何個出るかの確率です。`}
        </p>
        <DistributionChart
          points={faceCounts.map(({ count, ways, atLeastWays, atMostWays }) => ({
            x: count,
            ways,
            atLeastWays,
            atMostWays,
          }))}
          total={total}
          xName="個数"
          xUnit=" 個"
          modeLabels={{
            exact: 'ちょうどその個数',
            atLeast: 'その個数以上',
            atMost: 'その個数以下',
          }}
        />
      </TocSection>
    </>
  );
}

export default function DiceProbabilityCalculator({ initialFaces, initialCount }: Props) {
  const initial = initialDiceInput(initialFaces, initialCount);
  const [faces, setFaces] = useState<number | null>(initial.faces);
  const [count, setCount] = useState<number | null>(initial.count);
  const result = parseDiceInput(faces, count);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const dice = result.kind === 'ok' ? result.dice : null;
  const pending =
    dice !== null && !hydrated && dice.count * (dice.faces - 1) + 1 > SERVER_RENDER_MAX_SUMS;

  useEffect(() => {
    // 入力途中の空欄や範囲外の値で URL を書き換えると、再読み込みで結果が消えてしまう
    if (result.kind === 'ok') replaceUrlQuery(diceQueryString(result.dice));
  }, [faces, count]);

  return (
    <>
      <div class="card bg-base-100 shadow">
        <div class="card-body gap-3">
          <h2 class="card-title">サイコロ</h2>
          <div class="flex flex-wrap items-end gap-4">
            <NumberField
              label={`面数（${MIN_FACES}〜${MAX_FACES}）`}
              value={faces}
              min={MIN_FACES}
              max={MAX_FACES}
              widthClass="w-32"
              onInput={setFaces}
            />
            <NumberField
              label={`個数（1〜${MAX_DICE_COUNT}）`}
              value={count}
              min={1}
              max={MAX_DICE_COUNT}
              widthClass="w-32"
              onInput={setCount}
            />
            {result.kind === 'ok' && (
              <p class="pb-3 text-2xl font-bold">
                {result.dice.count}D{result.dice.faces}
              </p>
            )}
          </div>
          {result.kind === 'error' && (
            <div role="alert" class="alert alert-error">
              <span>{result.message}</span>
            </div>
          )}
          <p class="text-sm text-base-content/60">
            現実に無い面数も含め、どの目も同じ確率で出るサイコロとして、出目の組み合わせをすべて数えた正確な確率を計算します。
          </p>
        </div>
      </div>

      {dice === null && (
        <p class="text-center text-base-content/50">面数と個数を入力すると確率を計算します。</p>
      )}
      {pending && <p class="text-center text-base-content/50">計算しています…</p>}
      {dice !== null && !pending && <DiceResult dice={dice} />}
    </>
  );
}
