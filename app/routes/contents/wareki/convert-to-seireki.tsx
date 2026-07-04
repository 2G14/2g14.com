import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import WarekiToSeirekiConverter from '#app/islands/wareki-to-seireki-converter.js';

const PAGE_TITLE = '和暦→西暦 変換 - 和暦の日付を西暦に変換';
const META_DESCRIPTION =
  '和暦（令和・平成・昭和・大正・明治）の年月日を入力すると、対応する西暦に変換します。元号から西暦への変換に便利なツールです。';
const OG_DESCRIPTION =
  '和暦の日付を西暦に変換するツール。元号と年月日を入力するだけで簡単に変換できます。';

export default createRoute((c) => {
  const eraParam = c.req.query('era');
  const yearParam = c.req.query('year');
  const monthParam = c.req.query('month');
  const dayParam = c.req.query('day');
  const url = new URL(c.req.url);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="和暦→西暦 変換"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <div>
      <header class="navbar sticky top-0 z-30 min-h-12 bg-base-100 shadow-sm">
        <div class="flex-1">
          <h1 class="text-xl font-bold">和暦→西暦 変換</h1>
        </div>
      </header>

      <div class="mx-auto my-8 max-w-5xl px-4">
        <WarekiToSeirekiConverter
          initialEra={eraParam}
          initialYear={yearParam}
          initialMonth={monthParam}
          initialDay={dayParam}
        />
      </div>
    </div>,
    { title: PAGE_TITLE, head },
  );
});
