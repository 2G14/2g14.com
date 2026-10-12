import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolPageLayout from '#app/components/tool-page-layout.js';
import DateAfter from '#app/islands/days/date-after.js';

const PAGE_TITLE = '日数から日付を計算 - 〜日後・〜日前の日付と曜日';
const META_DESCRIPTION =
  'ある日から何日後・何日前の日付を計算します。100 日後や 1000 日後の日付と曜日、和暦を確認できます。';
const OG_DESCRIPTION = 'ある日から何日後・何日前の日付と曜日を計算するツール。';

export default createRoute((c) => {
  const url = new URL(c.req.url);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="日数から日付を計算"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <ToolPageLayout title="日数から日付を計算">
      <DateAfter initialBase={c.req.query('base')} initialDays={c.req.query('days')} />
    </ToolPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
