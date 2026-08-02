import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import { etoFromYear, JUNISHI, yearsForJunishi } from '#src/domain/eto/eto.js';
import { todayInJST } from '#src/lib/date.js';

const PAGE_TITLE = '干支一覧表 - 十二支と六十干支の一覧';
const META_DESCRIPTION =
  '十二支（子・丑・寅…）と六十干支（甲子・乙丑…）の一覧表。それぞれの読み方と直近の該当する西暦年を確認できます。';
const OG_DESCRIPTION = '十二支と六十干支の一覧表。読み方と該当する西暦年を確認できます。';

export default createRoute((c) => {
  const url = new URL(c.req.url);
  const currentYear = todayInJST().year;

  // 直近 60 年をちょうど 1 周分並べると、六十干支の全組み合わせが 1 回ずつ現れる
  const kanshiRows = Array.from({ length: 60 }, (_, i) => {
    const year = currentYear - 59 + i;
    return { year, eto: etoFromYear(year) };
  }).toSorted((a, b) => a.eto.kanshiNumber - b.eto.kanshiNumber);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="干支一覧表"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <div>
      <header class="navbar sticky top-0 z-30 min-h-12 bg-base-100 shadow-sm">
        <div class="flex-1">
          <h1 class="text-xl font-bold">干支一覧表</h1>
        </div>
      </header>

      <div class="mx-auto my-8 max-w-5xl px-4">
        <main class="grid grid-cols-1 items-start gap-8">
          <section id="junishi" class="scroll-mt-12">
            <h2 class="sticky top-12 z-20 rounded-xl bg-base-100/70 px-2 py-2 text-xl font-semibold backdrop-blur-md">
              十二支
            </h2>
            <div class="card mt-2 bg-base-100 shadow">
              <div class="card-body p-0">
                <div class="overflow-x-auto">
                  <table class="table table-zebra">
                    <caption class="sr-only">十二支の一覧表</caption>
                    <thead>
                      <tr>
                        <th>順番</th>
                        <th>十二支</th>
                        <th>読み</th>
                        <th>動物</th>
                        <th>直近の該当年</th>
                      </tr>
                    </thead>
                    <tbody>
                      {JUNISHI.map((junishi, i) => (
                        <tr class="hover:bg-base-200">
                          <td>{i + 1}</td>
                          <td class="font-bold">{junishi.kanji}</td>
                          <td>{junishi.kana}</td>
                          <td>
                            {junishi.animal} {junishi.emoji}
                          </td>
                          <td>
                            {yearsForJunishi(i, currentYear - 48, currentYear)
                              .map((y) => `${y}年`)
                              .join('、')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section id="kanshi" class="scroll-mt-12">
            <h2 class="sticky top-12 z-20 rounded-xl bg-base-100/70 px-2 py-2 text-xl font-semibold backdrop-blur-md">
              六十干支
            </h2>
            <div class="card mt-2 bg-base-100 shadow">
              <div class="card-body p-0">
                <div class="overflow-x-auto">
                  <table class="table table-zebra">
                    <caption class="sr-only">六十干支の一覧表</caption>
                    <thead>
                      <tr>
                        <th>番号</th>
                        <th>干支</th>
                        <th>読み</th>
                        <th>直近の該当年</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kanshiRows.map(({ year, eto }) => (
                        <tr class="hover:bg-base-200">
                          <td>{eto.kanshiNumber}</td>
                          <td class="font-bold">{eto.kanji}</td>
                          <td>{eto.reading}</td>
                          <td>{year}年</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>,
    { title: PAGE_TITLE, head },
  );
});
