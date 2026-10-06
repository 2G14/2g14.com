import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolPageLayout from '#app/components/tool-page-layout.js';
import AgeCalculator from '#app/islands/age-calculator.js';

const PAGE_TITLE = '生年月日から年齢計算 - 満年齢・数え年・生後日数';
const META_DESCRIPTION =
  '生年月日を入力すると、満年齢・数え年・次の誕生日までの日数・生後日数（日・週・ヶ月）を計算します。生まれた日の和暦や干支も確認できます。';
const OG_DESCRIPTION =
  '生年月日から満年齢・数え年・次の誕生日・生後日数を計算するツール。和暦・干支も表示します。';

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
      ogTitle="生年月日から年齢計算"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <ToolPageLayout title="生年月日から年齢計算">
      <AgeCalculator initialYear={yearParam} initialMonth={monthParam} initialDay={dayParam} />
    </ToolPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
