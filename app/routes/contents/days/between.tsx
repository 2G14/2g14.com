import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolPageLayout from '#app/components/tool-page-layout.js';
import DaysBetween from '#app/islands/days/days-between.js';

const PAGE_TITLE = '日付から日数を計算 - 〜まで何日・〜から何日目';
const META_DESCRIPTION =
  '2 つの日付の間の日数を計算します。今日から特定の日まであと何日か、ある日から数えて何日目かを、曜日とあわせて確認できます。';
const OG_DESCRIPTION = '2 つの日付の間の日数（〜まで何日、〜から何日目）を計算するツール。';

export default createRoute((c) => {
  const url = new URL(c.req.url);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="日付から日数を計算"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <ToolPageLayout title="日付から日数を計算">
      <DaysBetween initialFrom={c.req.query('from')} initialTo={c.req.query('to')} />
    </ToolPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
