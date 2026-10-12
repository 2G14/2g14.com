import { createRoute } from 'honox/factory';

import YakudoshiTable from '#app/components/age/yakudoshi-table.js';
import PageHead from '#app/components/page-head.js';
import ToolPageLayout from '#app/components/tool-page-layout.js';
import YakudoshiLookup from '#app/islands/age/yakudoshi-lookup.js';
import { yakudoshiInYear } from '#src/domain/age/yakudoshi.js';
import { todayInJST } from '#src/lib/date.js';

const PAGE_TITLE = '厄年早見表 - 今年の厄年と生まれ年ごとの本厄・前厄・後厄';
const META_DESCRIPTION =
  '今年厄年を迎える男性・女性の生まれ年の早見表。生まれ年を入力すると、その人の前厄・本厄・後厄の年も調べられます。';
const OG_DESCRIPTION = '今年の厄年の早見表と、生まれ年から本厄・前厄・後厄を調べるツール。';

export default createRoute((c) => {
  const yearParam = c.req.query('year');
  const url = new URL(c.req.url);
  const currentYear = todayInJST().year;

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="厄年早見表"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <ToolPageLayout title="厄年早見表">
      <div class="grid grid-cols-1 gap-6">
        <section class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">{currentYear}年の厄年</h2>
            <p class="text-sm text-base-content/60">
              {currentYear}年に厄年を迎える人の生まれ年です。
            </p>
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <section>
                <h3 class="font-semibold">男性</h3>
                <YakudoshiTable
                  caption={`${currentYear}年に厄年を迎える男性の生まれ年`}
                  periods={yakudoshiInYear(currentYear, 'male')}
                  show="birthYear"
                />
              </section>
              <section>
                <h3 class="font-semibold">女性</h3>
                <YakudoshiTable
                  caption={`${currentYear}年に厄年を迎える女性の生まれ年`}
                  periods={yakudoshiInYear(currentYear, 'female')}
                  show="birthYear"
                />
              </section>
            </div>
          </div>
        </section>

        <YakudoshiLookup initialYear={yearParam} />

        <p class="text-xs text-base-content/50">
          ※ 厄年は数え年（生まれた年を 1 歳とし、1 月 1 日に 1 歳加える）で数えます。
          立春を年の境目とする寺社や、女性の 61
          歳を厄年に含めない寺社など、数え方は地域や寺社によって異なります。
        </p>
      </div>
    </ToolPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
