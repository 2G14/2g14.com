import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import TocPageLayout from '#app/components/toc-page-layout.js';
import DiceProbabilityCalculator from '#app/islands/dice/dice-probability-calculator.js';
import { DICE_SECTIONS } from '#app/lib/dice/sections.js';

const PAGE_TITLE = 'サイコロの確率計算 - 2D6・3D6・1D100 などの出目の合計・ゾロ目の確率';
const META_DESCRIPTION =
  '2〜100 面のサイコロを 1〜100 個振ったときの確率を計算します。出目の合計ごとの確率と、その数以上・以下になる確率、ゾロ目や特定の目が何個出るかの確率を確認できます。';
const OG_DESCRIPTION =
  '2D6・3D6・1D100 などの出目の合計・ゾロ目・特定の目が出る確率を計算するツール。';

export default createRoute((c) => {
  const url = new URL(c.req.url);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="サイコロの確率計算"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <TocPageLayout title="サイコロの確率計算" tocItems={Object.values(DICE_SECTIONS)}>
      <DiceProbabilityCalculator
        initialQuery={{ faces: c.req.query('faces'), count: c.req.query('count') }}
      />
    </TocPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
