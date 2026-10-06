import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolPageLayout from '#app/components/tool-page-layout.js';
import { createSeireki } from '#src/domain/date/seireki.js';
import { etoFromYear } from '#src/domain/eto/eto.js';
import { seirekiToWareki } from '#src/domain/wareki/conversion.js';
import { formatSeirekiYear, formatWarekiEraYear } from '#src/domain/wareki/format.js';
import { todayInJST } from '#src/lib/date.js';

const PAGE_TITLE = '今年の干支 - 今年の十二支と十干十二支を表示';
const META_DESCRIPTION =
  '今年の干支（十二支）と十干十二支を表示します。今年が何年（えと）かをひと目で確認できます。';
const OG_DESCRIPTION = '今年の干支（十二支・十干十二支）を表示するページ。';

export default createRoute((c) => {
  const today = todayInJST();
  const eto = etoFromYear(today.year);
  const wareki = seirekiToWareki(createSeireki(today));

  const url = new URL(c.req.url);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="今年の干支"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <ToolPageLayout title="今年の干支">
      <div class="flex flex-col items-center gap-6 py-12">
        <p class="text-lg text-base-content/60">
          {formatSeirekiYear(today.year)}
          {wareki && `（${formatWarekiEraYear(wareki.era, wareki.year)}）`}の干支
        </p>
        <p class="text-6xl font-bold sm:text-8xl">
          {eto.junishi.kanji}
          <span class="ml-2 text-3xl sm:text-5xl">（{eto.junishi.kana}）</span>
        </p>
        <p class="text-3xl sm:text-4xl">
          {eto.junishi.animal} {eto.junishi.emoji}
        </p>
        <div class="text-center text-lg text-base-content/60">
          <p>
            十干十二支: {eto.kanji}（{eto.reading}）
          </p>
          <p>六十干支の {eto.kanshiNumber} 番目</p>
        </div>
        <p class="text-sm text-base-content/50">
          ※ 年の切り替わりは1月1日基準です（立春基準の暦もあります）。
        </p>
      </div>
    </ToolPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
