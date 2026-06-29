import { createRoute } from 'honox/factory';

import { ERAS } from '@/domain/wareki/era.js';

function anchorId(name: string) {
  return name.replace(/\s+/g, '-');
}

function yearsForEra(startYear: number, endSeirekiYear: number) {
  const maxYear = endSeirekiYear - (startYear - 1);
  const years: number[] = [];
  for (let y = Math.max(maxYear, 1); y >= 1; y--) years.push(y);
  return years;
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
      return c.redirect('/contents/wareki/comparation-table');
    }

    eras = [found];
  }

  const tocItems = eras.map((e) => e.name);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': url.href,
        url: url.href,
        name: '和暦/西暦 対比表 - 元号別の年号一覧',
        description:
          '明治以降の日本の元号（令和、平成など）と西暦を対比させた一覧表。元号ごとにセクション分けされており、各年の和暦と西暦を簡単に確認できます。',
      },
    ],
  } as const;

  const head = (
    <>
      <meta name="title" content="和暦/西暦 対比表 - 元号別の年号一覧" />
      <meta
        name="description"
        content="明治以降の日本の元号（令和、平成など）と西暦を対比させた一覧表。元号ごとにセクション分けされており、各年の和暦と西暦を簡単に確認できます。"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url.href} />
      <meta property="og:title" content="和暦/西暦 対比表" />
      <meta
        property="og:description"
        content="明治以降の日本の元号と西暦を対比させた一覧表。元号ごとの年号変換に便利です。"
      />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:url" content={url.href} />
      <meta property="twitter:title" content="和暦/西暦 対比表" />
      <meta
        property="twitter:description"
        content="明治以降の日本の元号と西暦を対比させた一覧表。元号ごとの年号変換に便利です。"
      />
      <link rel="canonical" href={url.href} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
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
            <label for="toc-drawer" class="btn btn-ghost btn-sm">目次</label>
          </div>
        </header>

        <div class="mx-auto my-8 max-w-5xl px-4">
          <div class="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_200px]">
            <main class="grid min-w-0 grid-cols-1 items-start gap-8">
              {eras.map((era) => {
                const eraEndSeirekiYear = era.end?.year ?? currentYear;
                const maxYear = eraEndSeirekiYear - (era.start.year - 1);
                if (maxYear < 1) return null;
                return (
                  <section id={anchorId(era.name)} style="scroll-margin-top: 3rem">
                    <h2 class="sticky top-12 z-20 rounded-xl bg-base-100/70 px-2 py-2 text-xl font-semibold backdrop-blur-md">
                      {era.name}
                    </h2>
                    <div class="card mt-2 bg-base-100 shadow">
                      <div class="card-body p-0">
                        <div class="overflow-x-auto">
                          <table class="table table-zebra">
                            <thead>
                              <tr>
                                <th>和暦</th>
                                <th>西暦</th>
                              </tr>
                            </thead>
                            <tbody>
                              {yearsForEra(era.start.year, eraEndSeirekiYear).map((wy) => {
                                const sy = era.start.year - 1 + wy;
                                return (
                                  <tr class="hover:bg-base-200">
                                    <td>{wy}年</td>
                                    <td>{sy}年</td>
                                  </tr>
                                );
                              })}
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
            <label for="toc-drawer" class="btn btn-ghost btn-sm btn-circle">&times;</label>
          </div>
          <ul class="menu">
            {tocItems.map((item) => (
              <li>
                <label for="toc-drawer">
                  <a href={`#${anchorId(item)}`}>{item}</a>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    { title: '和暦/西暦 対比表 - 元号別の年号一覧', head },
  );
});
