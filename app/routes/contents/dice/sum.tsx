import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolPageLayout from '#app/components/tool-page-layout.js';
import DiceSumCalculator from '#app/islands/dice/dice-sum-calculator.js';

const PAGE_TITLE = 'サイコロの合計の確率 - 2D6・3D6 などの出目の確率分布表';
const META_DESCRIPTION =
  'サイコロを複数個振ったときの出目の合計の確率を計算します。2D6・3D6 などの合計ごとの確率と、その数以上・以下になる確率、ゾロ目の確率を一覧で確認できます。';
const OG_DESCRIPTION = 'サイコロの出目の合計の確率分布表。2D6・3D6 などの確率を計算するツール。';

export default createRoute((c) => {
  const url = new URL(c.req.url);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="サイコロの合計の確率"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <ToolPageLayout title="サイコロの合計の確率">
      <DiceSumCalculator initialCount={c.req.query('count')} initialFaces={c.req.query('faces')} />
      <p class="mt-6 text-xs text-base-content/50">
        ※ どの目も同じ確率で出るサイコロとして、出目の組み合わせをすべて数えた正確な確率です。
      </p>
    </ToolPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
