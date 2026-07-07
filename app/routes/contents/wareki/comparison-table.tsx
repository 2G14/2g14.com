import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import { ERAS } from '#src/domain/wareki/era.js';

const PAGE_TITLE = '和暦/西暦 対比表 - 元号別の年号一覧';
const META_DESCRIPTION =
  '明治以降の日本の元号（令和、平成など）と西暦を対比させた一覧表。元号ごとにセクション分けされており、各年の和暦と西暦を簡単に確認できます。';
const OG_DESCRIPTION =
  '明治以降の日本の元号と西暦を対比させた一覧表。元号ごとの年号変換に便利です。';

function anchorId(name: string) {
  return name.replace(/\s+/g, '-');
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
  const currentYear = new Date().getFullYear();

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

  const tocItems = eras.map((e) => e.name);

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
    <div class="drawer drawer-end">
      <input id="toc-drawer" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content">
        <header class="navbar sticky top-0 z-30 min-h-12 bg-base-100 shadow-sm">
          <div class="flex-1">
            <h1 class="text-xl font-bold">和暦/西暦 対比表</h1>
          </div>
          <div class="flex-none md:hidden">
            <label for="toc-drawer" class="btn btn-ghost btn-sm">
              目次
            </label>
          </div>
        </header>

        <div class="mx-auto my-8 max-w-5xl px-4">
          <div class="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_200px]">
            <main class="grid min-w-0 grid-cols-1 items-start gap-8">
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
                                  <td>{wareki}年</td>
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
            </main>

            <aside class="hidden max-h-[calc(100vh-4rem)] w-48 self-start overflow-auto md:sticky md:top-24 md:block">
              <ul class="menu menu-sm">
                {tocItems.map((item) => (
                  <li>
                    <a href={`#${anchorId(item)}`}>{item}</a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </div>

      <div class="drawer-side z-40">
        <label for="toc-drawer" class="drawer-overlay" />
        <div class="min-h-full w-64 bg-base-100">
          <div class="flex items-center justify-between border-b border-base-300 px-4 py-3">
            <h2 class="text-lg font-semibold">目次</h2>
            <label for="toc-drawer" class="btn btn-circle btn-ghost btn-sm">
              &times;
            </label>
          </div>
          <ul class="menu">
            {tocItems.map((item) => (
              <li>
                <a
                  href={`#${anchorId(item)}`}
                  onclick="document.getElementById('toc-drawer').checked=false"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    { title: PAGE_TITLE, head },
  );
});
