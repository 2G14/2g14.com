import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolIndex from '#app/components/tool-index.js';

const PAGE_TITLE = '干支ツール';
const META_DESCRIPTION =
  '今年の干支の表示、生まれ年の干支検索、十二支・六十干支の一覧表など、干支（十干十二支）に関する各種ツールを提供します。';

const PAGES = [
  {
    href: '/contents/eto/this-year',
    label: '今年の干支',
    description: '今年の十二支と十干十二支を表示',
  },
  {
    href: '/contents/eto/search-by-year',
    label: '生まれ年の干支検索',
    description: '西暦年を入力してその年の干支を表示',
  },
  {
    href: '/contents/eto/list',
    label: '干支一覧表',
    description: '十二支と六十干支の一覧表',
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
