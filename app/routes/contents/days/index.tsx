import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolIndex from '#app/components/tool-index.js';

const PAGE_TITLE = '日数計算ツール';
const META_DESCRIPTION =
  '2 つの日付の間の日数や、ある日から何日後・何日前の日付と曜日を計算するツールを提供します。';

const PAGES = [
  {
    href: '/contents/days/between',
    label: '日付から日数を計算',
    description: '2 つの日付の間の日数（〜まで何日、〜から何日目）',
  },
  {
    href: '/contents/days/after',
    label: '日数から日付を計算',
    description: 'ある日から何日後・何日前の日付と曜日',
  },
] as const;

export default createRoute((c) => {
  const url = new URL(c.req.url);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle={PAGE_TITLE}
      ogDescription={META_DESCRIPTION}
    />
  );

  return c.render(<ToolIndex title={PAGE_TITLE} pages={PAGES} />, { title: PAGE_TITLE, head });
});
