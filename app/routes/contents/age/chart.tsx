import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import { etoFromYear } from '#src/domain/eto/eto.js';
import { warekiYearLabel } from '#src/domain/wareki/year-label.js';
import { todayInJST } from '#src/lib/date.js';

const PAGE_TITLE = '年齢早見表 - 生まれ年ごとの満年齢・数え年・和暦・干支';
const META_DESCRIPTION =
  '生まれ年（西暦）ごとの満年齢・数え年・和暦・干支の一覧表。今年の誕生日を迎えた後の満年齢をひと目で確認できます。';
const OG_DESCRIPTION = '生まれ年ごとの満年齢・数え年・和暦・干支がひと目でわかる年齢早見表。';

const YEARS_TO_SHOW = 121;

export default createRoute((c) => {
  const url = new URL(c.req.url);
  const currentYear = todayInJST().year;

  const rows = Array.from({ length: YEARS_TO_SHOW }, (_, i) => {
    const year = currentYear - i;
    return {
      year,
      warekiLabel: warekiYearLabel(year),
      fullAge: currentYear - year,
      kazoedoshi: currentYear - year + 1,
      eto: etoFromYear(year),
    };
  });

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="年齢早見表"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <div>
      <header class="navbar sticky top-0 z-30 min-h-12 bg-base-100 shadow-sm">
        <div class="flex-1">
          <h1 class="text-xl font-bold">年齢早見表</h1>
        </div>
      </header>

      <div class="mx-auto my-8 max-w-5xl px-4">
        <p class="mb-4 text-sm text-base-content/60">
          {currentYear}年の年齢早見表です。満年齢は今年の誕生日を迎えた後の年齢です（誕生日前は 1
          歳引いてください）。
        </p>

        <div class="card bg-base-100 shadow">
          <div class="card-body p-0">
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <caption class="sr-only">生まれ年ごとの年齢早見表</caption>
                <thead>
                  <tr>
                    <th>西暦</th>
                    <th>和暦</th>
                    <th>満年齢</th>
                    <th>数え年</th>
                    <th>干支</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr class="hover:bg-base-200">
                      <td>
                        <a href={`/contents/age/calculate?year=${row.year}`} class="link">
                          {row.year}年
                        </a>
                      </td>
                      <td>{row.warekiLabel ?? '—'}</td>
                      <td>{row.fullAge}歳</td>
                      <td>{row.kazoedoshi}歳</td>
                      <td>
                        <a href={`/contents/eto/search-by-year?year=${row.year}`} class="link">
                          {row.eto.junishi.kanji}（{row.eto.junishi.animal}）・{row.eto.kanji}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>,
    { title: PAGE_TITLE, head },
  );
});
