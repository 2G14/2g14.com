import { createRoute } from 'honox/factory';

import PeriodNav from '#app/components/koyomi/period-nav.js';
import RokuyoCalendar from '#app/components/koyomi/rokuyo-calendar.js';
import PageHead from '#app/components/page-head.js';
import ToolPageLayout from '#app/components/tool-page-layout.js';
import { parseKoyomiYear, parseMonth, shiftMonth } from '#app/lib/koyomi/koyomi-query.js';
import { formatSeirekiWithWeekday } from '#src/domain/date/format.js';
import { createSeireki } from '#src/domain/date/seireki.js';
import { toKyureki } from '#src/domain/koyomi/kyureki.js';
import { rokuyoOf } from '#src/domain/koyomi/rokuyo.js';
import { todayInJST } from '#src/lib/date.js';

const PAGE_TITLE = '六曜カレンダー - 大安・仏滅・友引と旧暦の日付';
const META_DESCRIPTION =
  '日ごとの六曜（先勝・友引・先負・仏滅・大安・赤口）と旧暦の日付がわかるカレンダー。今日の六曜や、結婚式・お葬式の日取りの確認に使えます。';
const OG_DESCRIPTION = '日ごとの六曜と旧暦の日付がわかるカレンダー。';

const monthHref = (ym: { year: number; month: number }) =>
  `/contents/koyomi/rokuyo?year=${ym.year}&month=${ym.month}`;

export default createRoute((c) => {
  const url = new URL(c.req.url);
  const today = todayInJST();
  const year = parseKoyomiYear(c.req.query('year'), today.year);
  const month = parseMonth(c.req.query('month'), today.month);
  const prev = shiftMonth({ year, month }, -1);
  const next = shiftMonth({ year, month }, 1);

  const todaySeireki = createSeireki(today);
  const todayKyureki = toKyureki(todaySeireki);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="六曜カレンダー"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <ToolPageLayout title="六曜カレンダー">
      <div class="grid grid-cols-1 gap-6">
        <section class="card bg-base-100 shadow">
          <div class="card-body items-center text-center">
            <h2 class="text-base-content/60">{formatSeirekiWithWeekday(todaySeireki)} の六曜</h2>
            <p class="text-5xl font-bold">{rokuyoOf(todayKyureki).name}</p>
            <p class="text-sm text-base-content/60">
              旧暦 {todayKyureki.year}年{todayKyureki.leap && '閏'}
              {todayKyureki.month}月{todayKyureki.day}日
            </p>
          </div>
        </section>

        <section class="card bg-base-100 shadow">
          <div class="card-body gap-4">
            <PeriodNav
              prev={prev && { href: monthHref(prev), label: `${prev.month}月` }}
              current={`${year}年${month}月`}
              next={next && { href: monthHref(next), label: `${next.month}月` }}
            />
            <RokuyoCalendar year={year} month={month} today={today} />
          </div>
        </section>

        <p class="text-xs text-base-content/50">
          ※ 六曜は旧暦の月日から決まり、旧暦の各月の 1 日を 1 月・7 月は先勝、2 月・8 月は友引、3
          月・9 月は先負、4 月・10 月は仏滅、5 月・11 月は大安、6 月・12
          月は赤口として、以降は日ごとに順に巡ります。
          旧暦は天保暦の決まりに沿って、朔（新月）と中気の日時を天文計算で求めたものです（対応範囲は
          1901〜2100 年）。2033 年は日本カレンダー暦文化振興協会の見解に沿って閏 11
          月を置いています。
        </p>
      </div>
    </ToolPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
