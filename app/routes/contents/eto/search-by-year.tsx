import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import EtoYearSearch from '#app/islands/eto-year-search.js';

const PAGE_TITLE = '生まれ年の干支検索 - 西暦年から干支を調べる';
const META_DESCRIPTION =
  '西暦年を入力すると、その年の干支（十二支）と十干十二支を表示します。生まれ年の干支を調べるのに便利なツールです。';
const OG_DESCRIPTION = '西暦年から干支（十二支・十干十二支）を検索するツール。';

export default createRoute((c) => {
  const yearParam = c.req.query('year');
  const url = new URL(c.req.url);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="生まれ年の干支検索"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <div>
      <header class="navbar sticky top-0 z-30 min-h-12 bg-base-100 shadow-sm">
        <div class="flex-1">
          <h1 class="text-xl font-bold">生まれ年の干支検索</h1>
        </div>
      </header>

      <div class="mx-auto my-8 max-w-5xl px-4">
        <EtoYearSearch initialYear={yearParam} />
      </div>
    </div>,
    { title: PAGE_TITLE, head },
  );
});
