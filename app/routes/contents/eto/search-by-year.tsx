import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolPageLayout from '#app/components/tool-page-layout.js';
import EtoYearSearch from '#app/islands/eto/eto-year-search.js';

const PAGE_TITLE = '生まれ年の干支検索 - 西暦年から干支を調べる';
const META_DESCRIPTION =
  '西暦年を入力すると、その年の干支（十二支）と十干十二支を表示します。生まれ年の干支を調べるのに便利なツールです。';
const OG_DESCRIPTION = '西暦年から干支（十二支・十干十二支）を検索するツール。';

export default createRoute((c) => {
  const yearParam = c.req.query('year');
  const url = new URL(c.req.url);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="生まれ年の干支検索"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <ToolPageLayout title="生まれ年の干支検索">
      <EtoYearSearch initialYear={yearParam} />
    </ToolPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
