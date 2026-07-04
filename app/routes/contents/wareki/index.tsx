import { createRoute } from 'honox/factory';

import PageHead from '../../../components/page-head.js';

const PAGE_TITLE = '和暦ツール';
const META_DESCRIPTION =
  '和暦と西暦の相互変換、対比表、本日の和暦表示など、和暦に関する各種ツールを提供します。';

const PAGES = [
  {
    href: '/contents/wareki/today',
    label: '本日の和暦',
    description: '今日の日付を和暦で表示',
  },
  {
    href: '/contents/wareki/comparison-table',
    label: '和暦/西暦 対比表',
    description: '明治以降の元号と西暦の一覧表',
  },
  {
    href: '/contents/wareki/convert-from-seireki',
    label: '西暦→和暦 変換',
    description: '西暦の年月日を入力して和暦に変換',
  },
  {
    href: '/contents/wareki/convert-to-seireki',
    label: '和暦→西暦 変換',
    description: '和暦の年月日を入力して西暦に変換',
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

  return c.render(
    <div>
      <header class="navbar sticky top-0 z-30 min-h-12 bg-base-100 shadow-sm">
        <div class="flex-1">
          <h1 class="text-xl font-bold">{PAGE_TITLE}</h1>
        </div>
      </header>

      <div class="mx-auto my-8 max-w-5xl px-4">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PAGES.map((page) => (
            <a href={page.href} class="card bg-base-100 shadow transition-shadow hover:shadow-md">
              <div class="card-body p-4">
                <h2 class="card-title text-base">{page.label}</h2>
                <p class="text-sm text-base-content/60">{page.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>,
    { title: PAGE_TITLE, head },
  );
});
