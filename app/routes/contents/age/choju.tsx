import { createRoute } from 'honox/factory';

import ChojuTable from '#app/components/age/choju-table.js';
import PageHead from '#app/components/page-head.js';
import ToolPageLayout from '#app/components/tool-page-layout.js';
import ChojuLookup from '#app/islands/age/choju-lookup.js';
import { chojuBirthYearsInYear } from '#src/domain/age/choju.js';
import { todayInJST } from '#src/lib/date.js';

const PAGE_TITLE = '長寿祝い一覧 - 還暦・古希・喜寿・米寿などの年齢と生まれ年';
const META_DESCRIPTION =
  '還暦・古希・喜寿・傘寿・米寿・卒寿・白寿など長寿祝いの一覧。今年それぞれの祝いを迎える生まれ年を数え年・満年齢の両方で確認でき、名称の由来も紹介します。';
const OG_DESCRIPTION = '長寿祝いの一覧と、今年祝いを迎える生まれ年（数え年・満年齢）の早見表。';

export default createRoute((c) => {
  const yearParam = c.req.query('year');
  const url = new URL(c.req.url);
  const currentYear = todayInJST().year;

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="長寿祝い一覧"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <ToolPageLayout title="長寿祝い一覧">
      <div class="grid grid-cols-1 gap-6">
        <section class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">{currentYear}年に長寿祝いを迎える人</h2>
            <ChojuTable
              caption={`${currentYear}年に長寿祝いを迎える人の生まれ年`}
              rows={chojuBirthYearsInYear(currentYear).map((y) => ({
                choju: y.choju,
                kazoedoshi: y.kazoedoshiBirthYear,
                fullAge: y.fullAgeBirthYear,
              }))}
              yearLabel="生まれ年"
              showOrigin
            />
          </div>
        </section>

        <ChojuLookup initialYear={yearParam} />

        <p class="text-xs text-base-content/50">
          ※ 長寿祝いは本来数え年（生まれた年を 1 歳とし、1 月 1 日に 1 歳加える）で祝いますが、
          近年は満年齢で祝うことも多くなっています。還暦は数え 61 歳（満 60 歳）、大還暦は数え 121
          歳（満 120 歳）です。
        </p>
      </div>
    </ToolPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
