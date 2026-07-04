import { createRoute } from 'honox/factory';

import PageHead from '../../../components/page-head.js';
import SeirekiToWarekiConverter from '../../../islands/seireki-to-wareki-converter.js';

const PAGE_TITLE = '西暦→和暦 変換 - 西暦の日付を和暦に変換';
const META_DESCRIPTION =
  '西暦の年月日を入力すると、対応する和暦（令和・平成・昭和・大正・明治）に変換します。日付の和暦変換に便利なツールです。';
const OG_DESCRIPTION =
  '西暦の日付を和暦に変換するツール。年月日を入力するだけで簡単に変換できます。';

export default createRoute((c) => {
  const yearParam = c.req.query('year');
  const monthParam = c.req.query('month');
  const dayParam = c.req.query('day');
  const url = new URL(c.req.url);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="西暦→和暦 変換"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <div>
      <header class="navbar sticky top-0 z-30 min-h-12 bg-base-100 shadow-sm">
        <div class="flex-1">
          <h1 class="text-xl font-bold">西暦→和暦 変換</h1>
        </div>
      </header>

      <div class="mx-auto my-8 max-w-5xl px-4">
        <SeirekiToWarekiConverter
          initialYear={yearParam}
          initialMonth={monthParam}
          initialDay={dayParam}
        />
      </div>
    </div>,
    { title: PAGE_TITLE, head },
  );
});
