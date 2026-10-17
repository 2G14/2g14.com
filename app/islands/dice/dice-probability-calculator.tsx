import { useEffect, useMemo, useState } from 'hono/jsx';

import DistributionChart, { type AxisLabel } from '#app/components/dice/distribution-chart.js';
import ProbabilityGauge from '#app/components/dice/probability-gauge.js';
import StatTile from '#app/components/dice/stat-tile.js';
import NumberField from '#app/components/number-field.js';
import TocSection from '#app/components/toc-section.js';
import {
  type DiceInputValues,
  type ParsedDiceInput,
  parseDiceInput,
} from '#app/lib/dice/dice-input.js';
import { diceQueryString, initialDiceInput } from '#app/lib/dice/dice-query.js';
import { formatProbability, formatWays } from '#app/lib/dice/format.js';
import { DICE_SECTIONS } from '#app/lib/dice/sections.js';
import { replaceUrlQuery } from '#app/lib/url.js';
import {
  type DiceSet,
  MAX_DICE_COUNT,
  MAX_FACES,
  MIN_DICE_COUNT,
  isSameDiceSet,
  MIN_FACES,
  sumRange,
  totalOutcomes,
} from '#src/domain/dice/dice-set.js';
import { mostLikely } from '#src/domain/dice/distribution.js';
import {
  allSameWays,
  atLeastOneWays,
  expectedSum,
  faceCountDistribution,
  sumDistribution,
} from '#src/domain/dice/probability.js';
import { sameFaceDistribution } from '#src/domain/dice/same-face.js';

/**
 * サーバーで描画するサイコロの組の上限。100 面 100 個（合計 9,901 種類）などを描画すると、Workers の
 * リクエストあたりの CPU 時間の制限を超えるおそれがあるため、大きな組はブラウザでだけ計算する
 */
const SERVER_RENDER_MAX_SUMS = 200;
const SERVER_RENDER_MAX_COUNT = 20;

/**
 * 入力が止まってから計算を始めるまでの時間。「100」と打つと 1・10・100 の 3 回分の計算が走り、
 * 100 個では 1 回に 0.1 秒以上かかるため、打ち終わるのを待つ
 */
const INPUT_SETTLE_MS = 300;

const SUM_AXIS: AxisLabel = { name: '合計', unit: '' };
const FACE_COUNT_AXIS: AxisLabel = { name: '個数', unit: '個' };
const SAME_FACE_AXIS: AxisLabel = { name: '同じ目', unit: '個' };
const SUM_MODE_LABELS = { exact: 'その数', atLeast: 'その数以上', atMost: 'その数以下' } as const;
const COUNT_MODE_LABELS = {
  exact: 'ちょうどその個数',
  atLeast: 'その個数以上',
  atMost: 'その個数以下',
} as const;

function canRenderOnServer(dice: DiceSet): boolean {
  const range = sumRange(dice);
  return (
    range.max - range.min + 1 <= SERVER_RENDER_MAX_SUMS && dice.count <= SERVER_RENDER_MAX_COUNT
  );
}

interface Props {
  initialFaces?: string | undefined;
  initialCount?: string | undefined;
}

interface DiceResultProps {
  dice: DiceSet;
}

function DiceResult({ dice }: DiceResultProps) {
  // 入力中は親が再描画されるが、確定した組が同じ参照のまま渡ってくる間は分布を数え直さない
  const sums = useMemo(() => sumDistribution(dice), [dice]);
  const faceCounts = useMemo(() => faceCountDistribution(dice), [dice]);
  const sameFaces = useMemo(() => (dice.count >= 2 ? sameFaceDistribution(dice) : null), [dice]);
  const total = totalOutcomes(dice);
  const range = sumRange(dice);
  const peak = mostLikely(sums);

  return (
    <>
      <TocSection item={DICE_SECTIONS.summary}>
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile title="合計の範囲" value={`${range.min}〜${range.max}`} />
          <StatTile title="合計の平均（期待値）" value={expectedSum(dice)} />
          <StatTile
            title="最も出やすい合計"
            // 1 個なら全ての合計が同じ確率で、並べると合計の数だけ値が並んでしまう
            value={peak.values.length === sums.length ? 'すべて同じ' : peak.values.join('・')}
            description={`${peak.values.length > 1 ? 'それぞれ ' : ''}${formatProbability(peak.ways, total)}`}
          />
          <StatTile
            title="出目の組み合わせ"
            // 9 桁以上はタイルの幅に収まらないため、指数の形にする
            value={formatWays(total, 8)}
            description="通り"
          />
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
          <ProbabilityGauge
            title="特定の目が 1 個以上出る"
            description={`たとえば ${dice.faces} の目`}
            ways={atLeastOneWays(dice)}
            total={total}
          />
        </div>
      </TocSection>

      <TocSection item={DICE_SECTIONS.sum}>
        <DistributionChart rows={sums} total={total} axis={SUM_AXIS} modeLabels={SUM_MODE_LABELS} />
      </TocSection>

      <TocSection item={DICE_SECTIONS.faceCount}>
        <p class="text-sm text-base-content/70">
          {`${dice.count} 個のうち、特定の目（たとえば ${dice.faces} の目）が何個出るかの確率です。`}
        </p>
        <DistributionChart
          rows={faceCounts}
          total={total}
          axis={FACE_COUNT_AXIS}
          modeLabels={COUNT_MODE_LABELS}
        />
      </TocSection>

      <TocSection item={DICE_SECTIONS.sameFace}>
        {sameFaces === null ? (
          // 目次から飛べるようセクションは残し、1 個では同じ目になりようがないことだけを書く
          <p class="text-sm text-base-content/70">1 個では同じ目は出ません。</p>
        ) : (
          <>
            <p class="text-sm text-base-content/70">
              {`${dice.count} 個のうち、同じ目が最も多く出たのが何個かの確率です（目はどれでもよい）。${dice.count} 個ならゾロ目、1 個なら全部違う目です。`}
            </p>
            <DistributionChart
              rows={sameFaces}
              total={total}
              axis={SAME_FACE_AXIS}
              modeLabels={COUNT_MODE_LABELS}
            />
          </>
        )}
      </TocSection>
    </>
  );
}

/** 入力が止まった時点の入力欄の値と、その検証結果、最後に正しく入力されたサイコロの組 */
interface SettledInput {
  readonly values: DiceInputValues;
  readonly result: ParsedDiceInput;
  /** 計算に使う組。エラーや空欄のあいだも、前の結果を薄く残すために前の組を持ち続ける */
  readonly dice: DiceSet | null;
}

export default function DiceProbabilityCalculator({ initialFaces, initialCount }: Props) {
  const initial = initialDiceInput({ faces: initialFaces, count: initialCount });
  const [faces, setFaces] = useState<number | null>(initial.faces);
  const [count, setCount] = useState<number | null>(initial.count);
  const result = parseDiceInput({ faces, count });
  // 入力が止まってから、エラーの表示と計算に使うサイコロの組を更新する。「12」と打つ途中の「1」で
  // エラーを出したり結果を消したりしないよう、打っている間は前の結果を薄くして残す
  const [settled, setSettled] = useState<SettledInput>({
    values: { faces, count },
    result,
    dice: result.kind === 'ok' ? result.dice : null,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSettled((prev) => {
        if (result.kind !== 'ok') return { values: { faces, count }, result, dice: prev.dice };
        // 同じ組なら前の参照を残し、分布を数え直さない
        const same = prev.dice !== null && isSameDiceSet(prev.dice, result.dice);
        return { values: { faces, count }, result, dice: same ? prev.dice : result.dice };
      });
      if (result.kind === 'ok') replaceUrlQuery(diceQueryString(result.dice));
    }, INPUT_SETTLE_MS);
    return () => clearTimeout(timer);
  }, [faces, count]);

  const typing = settled.values.faces !== faces || settled.values.count !== count;
  const { dice } = settled;
  const shown = settled.result.kind === 'ok' ? settled.result.dice : null;
  const pending = dice !== null && !hydrated && !canRenderOnServer(dice);

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
              label={`個数（${MIN_DICE_COUNT}〜${MAX_DICE_COUNT}）`}
              value={count}
              min={MIN_DICE_COUNT}
              max={MAX_DICE_COUNT}
              widthClass="w-32"
              onInput={setCount}
            />
            {/* 打っている途中の値ではなく、下に表示している結果と同じ組を出す */}
            {shown !== null && (
              <p class={`pb-3 text-2xl font-bold ${typing ? 'opacity-50' : ''}`}>
                {shown.count}D{shown.faces}
              </p>
            )}
          </div>
          {!typing && settled.result.kind === 'error' && (
            <div role="alert" class="alert alert-error">
              <span>{settled.result.message}</span>
            </div>
          )}
          {!typing && settled.result.kind === 'empty' && (
            <p class="text-sm text-base-content/70">面数と個数を入力すると確率を計算します。</p>
          )}
          <p class="text-sm text-base-content/60">
            現実に無い面数も含め、どの目も同じ確率で出るサイコロとして、出目の組み合わせをすべて数えた正確な確率を計算します。
          </p>
        </div>
      </div>

      {pending && <p class="text-center text-base-content/50">計算しています…</p>}
      {dice !== null && !pending && (
        <div
          class={`flex flex-col gap-8 transition-opacity ${shown === null || typing ? 'opacity-50' : ''}`}
          aria-busy={String(typing)}
        >
          <DiceResult dice={dice} />
        </div>
      )}
    </>
  );
}
