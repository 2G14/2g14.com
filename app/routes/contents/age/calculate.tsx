import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
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
    <div>
      <header class="navbar sticky top-0 z-30 min-h-12 bg-base-100 shadow-sm">
        <div class="flex-1">
          <h1 class="text-xl font-bold">生年月日から年齢計算</h1>
        </div>
      </header>

      <div class="mx-auto my-8 max-w-5xl px-4">
        <AgeCalculator initialYear={yearParam} initialMonth={monthParam} initialDay={dayParam} />
      </div>
    </div>,
    { title: PAGE_TITLE, head },
  );
});
