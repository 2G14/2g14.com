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
    <>
      <header class="sticky top-0 z-30 grid h-12 grid-cols-[1fr_auto] items-center border-b bg-white px-4">
        <h1 class="truncate text-2xl font-bold">和暦/西暦 対比表</h1>
        <button
          id="toc-open"
          class="rounded-md px-3 py-1 text-sm hover:bg-slate-100 md:hidden"
          type="button"
        >
          目次
        </button>
      </header>

      <dialog
        id="toc-dialog"
        class="m-0 ml-auto h-full max-h-full w-64 bg-white p-0 backdrop:bg-black/50 open:flex open:flex-col"
      >
        <div class="flex items-center justify-between border-b px-4 py-3">
          <h2 class="text-lg font-semibold">目次</h2>
          <button id="toc-close" class="text-xl leading-none" type="button">
            &times;
          </button>
        </div>
        <nav class="flex flex-col gap-1 overflow-auto p-2">
          {tocItems.map((item) => (
            <a
              class="toc-link block rounded-md px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
              href={`#${anchorId(item)}`}
            >
              {item}
            </a>
          ))}
        </nav>
      </dialog>

      <div class="mx-auto my-8 max-w-5xl px-4">
        <div class="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_200px]">
          <main class="grid min-w-0 grid-cols-1 items-start gap-8">
            {eras.map((era) => {
              const eraEndSeirekiYear = era.end?.year ?? currentYear;
              const maxYear = eraEndSeirekiYear - (era.start.year - 1);
              if (maxYear < 1) return null;
              return (
                <section id={anchorId(era.name)} style="scroll-margin-top: 3rem">
                  <h2 class="sticky top-12 z-20 rounded-xl bg-white/70 px-2 py-2 text-xl font-semibold backdrop-blur-md">
                    {era.name}
                  </h2>
                  <div class="mt-2 overflow-hidden rounded-xl border bg-card text-card-foreground">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="bg-slate-50">
                          <th class="px-3 py-2 text-left font-medium">和暦</th>
                          <th class="border-l px-3 py-2 text-left font-medium">西暦</th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearsForEra(era.start.year, eraEndSeirekiYear).map((wy) => {
                          const sy = era.start.year - 1 + wy;
                          return (
                            <tr class="border-t hover:bg-slate-50">
                              <td class="px-3 py-2">{wy}年</td>
                              <td class="border-l px-3 py-2">{sy}年</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })}
          </main>

          <aside class="hidden max-h-[calc(100vh-4rem)] w-48 self-start overflow-auto md:sticky md:top-24 md:block">
            <nav class="flex flex-col gap-1 p-2">
              {tocItems.map((item) => (
                <a
                  class="block rounded-md px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
                  href={`#${anchorId(item)}`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            const dialog = document.getElementById('toc-dialog');
            document.getElementById('toc-open').addEventListener('click', () => dialog.showModal());
            document.getElementById('toc-close').addEventListener('click', () => dialog.close());
            dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
            dialog.querySelectorAll('.toc-link').forEach(a => a.addEventListener('click', () => dialog.close()));
          `,
        }}
      />
    </>,
    { title: '和暦/西暦 対比表 - 元号別の年号一覧', head },
  );
});
