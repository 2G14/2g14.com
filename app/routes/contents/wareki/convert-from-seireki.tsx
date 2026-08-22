import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolPageLayout from '#app/components/tool-page-layout.js';
import SeirekiToWarekiConverter from '#app/islands/wareki/seireki-to-wareki-converter.js';

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
    <ToolPageLayout title="西暦→和暦 変換">
      <SeirekiToWarekiConverter
        initialYear={yearParam}
        initialMonth={monthParam}
        initialDay={dayParam}
      />
    </ToolPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
