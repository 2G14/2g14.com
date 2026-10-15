import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolIndex from '#app/components/tool-index.js';

const PAGE_TITLE = 'モールス信号';
const META_DESCRIPTION =
  '和文・欧文のモールス信号の一覧表など、モールス信号に関するコンテンツを提供します。';

const PAGES = [
  {
    href: '/contents/morse/list',
    label: 'モールス信号一覧表',
    description:
      '和文（仮名）・欧文（アルファベット）・数字・記号のモールス符号と、モールス信号の仕組み',
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
