import { createRoute } from 'honox/factory';

import PageHead from '../../../components/page-head.js';

import { seirekiToWareki } from '@/domain/wareki/conversion.js';
import { createSeireki } from '@/domain/wareki/seireki.js';

const PAGE_TITLE = '本日の和暦 - 今日の日付を和暦で表示';
const META_DESCRIPTION =
  '今日の日付を和暦（令和）で表示します。本日が和暦で何年何月何日かをひと目で確認できます。';
const OG_DESCRIPTION = '今日の日付を和暦で表示するページ。';

export default createRoute((c) => {
  const now = new Date();
  const seireki = createSeireki({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
  const wareki = seirekiToWareki(seireki);

  const url = new URL(c.req.url);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="本日の和暦"
      ogDescription={OG_DESCRIPTION}
    />
  );

  const displayYear = wareki ? `${wareki.era}${wareki.year}年` : `${seireki.year}年`;
  const displayDate = `${seireki.month}月${seireki.day}日`;

  return c.render(
    <div>
      <header class="navbar sticky top-0 z-30 min-h-12 bg-base-100 shadow-sm">
        <div class="flex-1">
          <h1 class="text-xl font-bold">本日の和暦</h1>
        </div>
      </header>

      <div class="mx-auto my-8 max-w-5xl px-4">
        <div class="flex flex-col items-center gap-6 py-12">
          <p class="text-5xl font-bold sm:text-7xl">{displayYear}</p>
          <p class="text-4xl font-bold sm:text-6xl">{displayDate}</p>
          <p class="text-lg text-base-content/60">
            （{seireki.year}年{seireki.month}月{seireki.day}日）
          </p>
        </div>
      </div>
    </div>,
    { title: PAGE_TITLE, head },
  );
});
