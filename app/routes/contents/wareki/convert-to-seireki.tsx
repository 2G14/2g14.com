import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolPageLayout from '#app/components/tool-page-layout.js';
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
    <ToolPageLayout title="和暦→西暦 変換">
      <WarekiToSeirekiConverter
        initialEra={eraParam}
        initialYear={yearParam}
        initialMonth={monthParam}
        initialDay={dayParam}
      />
    </ToolPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
