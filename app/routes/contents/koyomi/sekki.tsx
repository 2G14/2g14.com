import { createRoute } from 'honox/factory';

import PeriodNav from '#app/components/koyomi/period-nav.js';
import PageHead from '#app/components/page-head.js';
import ToolPageLayout from '#app/components/tool-page-layout.js';
import { parseKoyomiYear, shiftYear } from '#app/lib/koyomi/koyomi-query.js';
import { formatSeirekiWithWeekday } from '#src/domain/date/format.js';
import { sekkiOfYear } from '#src/domain/koyomi/sekki.js';
import { todayInJST } from '#src/lib/date.js';

const PAGE_TITLE = '二十四節気一覧 - 立春・春分・夏至・秋分・冬至などの日付';
const META_DESCRIPTION =
  '二十四節気（小寒・大寒・立春・雨水・啓蟄・春分…冬至）の日付の一覧。年ごとの春分の日・秋分の日なども確認できます。';
const OG_DESCRIPTION = '二十四節気の読み方と、年ごとの日付の一覧表。';

const yearHref = (year: number) => `/contents/koyomi/sekki?year=${year}`;

export default createRoute((c) => {
  const url = new URL(c.req.url);
  const year = parseKoyomiYear(c.req.query('year'), todayInJST().year);
  const prev = shiftYear(year, -1);
  const next = shiftYear(year, 1);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="二十四節気一覧"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <ToolPageLayout title="二十四節気一覧">
      <div class="grid grid-cols-1 gap-6">
        <section class="card bg-base-100 shadow">
          <div class="card-body gap-4">
            <PeriodNav
              prev={prev === null ? null : { href: yearHref(prev), label: `${prev}年` }}
              current={`${year}年`}
              next={next === null ? null : { href: yearHref(next), label: `${next}年` }}
            />
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <caption class="sr-only">{year}年の二十四節気</caption>
                <thead>
                  <tr>
                    <th>節気</th>
                    <th>読み</th>
                    <th>太陽黄経</th>
                    <th>日付</th>
                  </tr>
                </thead>
                <tbody>
                  {sekkiOfYear(year).map(({ sekki, date }) => (
                    <tr>
                      <th class="whitespace-nowrap">
                        {sekki.name}
                        {sekki.chuki && <span class="ml-1 badge badge-ghost badge-xs">中気</span>}
                      </th>
                      <td class="whitespace-nowrap">{sekki.reading}</td>
                      <td>{sekki.longitude}°</td>
                      <td class="whitespace-nowrap">{formatSeirekiWithWeekday(date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <p class="text-xs text-base-content/50">
          ※ 二十四節気は、太陽の通り道（黄道）を 15 度ずつ 24
          に分けた点を太陽が通る日です。日付は太陽の位置を天文計算で求めた日本時間の日付です（対応範囲は
          1901〜2100 年）。計算の誤差は 1 分程度のため、節気の時刻が午前 0
          時に近い年は、国立天文台の発表と日付がずれることがあります。春分の日・秋分の日の祝日は、前年の官報で正式に決まります。
        </p>
      </div>
    </ToolPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
