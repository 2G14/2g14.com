import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolIndex from '#app/components/tool-index.js';

const PAGE_TITLE = 'サイコロ';
const META_DESCRIPTION =
  'サイコロの出目の合計やゾロ目の確率など、サイコロに関するツールを提供します。';

const PAGES = [
  {
    href: '/contents/dice/probability',
    label: 'サイコロの確率計算',
    description: '2D6・3D6・1D100 などの出目の合計・ゾロ目・特定の目が出る確率',
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
