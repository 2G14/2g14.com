import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolIndex from '#app/components/tool-index.js';

const PAGE_TITLE = '暦ツール';
const META_DESCRIPTION =
  '六曜（大安・仏滅など）と旧暦の日付がわかるカレンダーや、二十四節気の日付の一覧など、暦に関する各種ツールを提供します。';

const PAGES = [
  {
    href: '/contents/koyomi/rokuyo',
    label: '六曜カレンダー',
    description: '日ごとの六曜と旧暦の日付',
  },
  {
    href: '/contents/koyomi/sekki',
    label: '二十四節気一覧',
    description: '立春・春分・夏至などの二十四節気の日付',
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
