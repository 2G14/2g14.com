import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import TocPageLayout from '#app/components/toc-page-layout.js';
import { ERAS } from '#src/domain/wareki/era.js';
import { formatWarekiYear } from '#src/domain/wareki/format.js';
import { todayInJST } from '#src/lib/date.js';

const PAGE_TITLE = '和暦/西暦 対比表 - 元号別の年号一覧';
const META_DESCRIPTION =
  '明治以降の日本の元号（令和、平成など）と西暦を対比させた一覧表。元号ごとにセクション分けされており、各年の和暦と西暦を簡単に確認できます。';
const OG_DESCRIPTION =
  '明治以降の日本の元号と西暦を対比させた一覧表。元号ごとの年号変換に便利です。';

function anchorId(name: string) {
  return name.replaceAll(/\s+/gu, '-');
}

function eraYearPairs(startYear: number, endSeirekiYear: number) {
  const pairs: { wareki: number; seireki: number }[] = [];
  for (let s = endSeirekiYear; s >= startYear; s--) {
    pairs.push({ wareki: s - startYear + 1, seireki: s });
  }
  return pairs;
}

export default createRoute((c) => {
  const eraParam = c.req.query('era');
  const url = new URL(c.req.url);
  const currentYear = todayInJST().year;

  let eras = ERAS;

  if (eraParam) {
    const found = ERAS.find(
      (e) =>
        e.name === eraParam ||
        e.nameKana === eraParam ||
        e.nameEn === eraParam ||
        e.abbreviation === eraParam,
    );

    if (!found) {
      return c.redirect('/contents/wareki/comparison-table');
    }

    eras = [found];
  }

  const tocItems = eras.map((e) => ({ id: anchorId(e.name), label: e.name }));

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="和暦/西暦 対比表"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <TocPageLayout title="和暦/西暦 対比表" tocItems={tocItems}>
      {eras.map((era) => {
        const endYear = era.end?.year ?? currentYear;
        const pairs = eraYearPairs(era.start.year, endYear);
        if (pairs.length === 0) return null;
        return (
          <section id={anchorId(era.name)} class="scroll-mt-12">
            <h2 class="sticky top-12 z-20 rounded-xl bg-base-100/70 px-2 py-2 text-xl font-semibold backdrop-blur-md">
              {era.name}
            </h2>
            <div class="card mt-2 bg-base-100 shadow">
              <div class="card-body p-0">
                <div class="overflow-x-auto">
                  <table class="table table-zebra">
                    <caption class="sr-only">{era.name}の和暦・西暦対比表</caption>
                    <thead>
                      <tr>
                        <th>和暦</th>
                        <th>西暦</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pairs.map(({ wareki, seireki }) => (
                        <tr class="hover:bg-base-200">
                          <td>{formatWarekiYear(wareki)}</td>
                          <td>{seireki}年</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </TocPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
