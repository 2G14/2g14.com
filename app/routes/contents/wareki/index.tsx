import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolIndex from '#app/components/tool-index.js';

const PAGE_TITLE = '和暦ツール';
const META_DESCRIPTION =
  '和暦と西暦の相互変換、対比表、本日の和暦表示など、和暦に関する各種ツールを提供します。';

const PAGES = [
  {
    href: '/contents/wareki/today',
    label: '本日の和暦',
    description: '今日の日付を和暦で表示',
  },
  {
    href: '/contents/wareki/comparison-table',
    label: '和暦/西暦 対比表',
    description: '明治以降の元号と西暦の一覧表',
  },
  {
    href: '/contents/wareki/convert-from-seireki',
    label: '西暦→和暦 変換',
    description: '西暦の年月日を入力して和暦に変換',
  },
  {
    href: '/contents/wareki/convert-to-seireki',
    label: '和暦→西暦 変換',
    description: '和暦の年月日を入力して西暦に変換',
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
