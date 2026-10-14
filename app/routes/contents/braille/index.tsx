import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolIndex from '#app/components/tool-index.js';

const PAGE_TITLE = '点字';
const META_DESCRIPTION =
  '日本語の点字（六点点字）の一覧表など、点字に関するコンテンツを提供します。';

const PAGES = [
  {
    href: '/contents/braille/list',
    label: '点字一覧表',
    description: '五十音・濁音・拗音・特殊音・句読点・数字・アルファベットの点字と、点字の仕組み',
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
