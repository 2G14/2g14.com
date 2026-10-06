import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolIndex from '#app/components/tool-index.js';

const PAGE_TITLE = '年齢計算ツール';
const META_DESCRIPTION =
  '生年月日からの年齢計算（満年齢・数え年・次の誕生日・生後日数）や年齢早見表など、年齢に関する各種ツールを提供します。';

const PAGES = [
  {
    href: '/contents/age/calculate',
    label: '生年月日から年齢計算',
    description: '満年齢・数え年・次の誕生日・生後日数を計算',
  },
  {
    href: '/contents/age/chart',
    label: '年齢早見表',
    description: '生まれ年ごとの満年齢・数え年・和暦・干支の一覧表',
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
