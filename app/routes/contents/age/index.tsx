import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';

const PAGE_TITLE = '年齢計算ツール';
const META_DESCRIPTION =
  '生年月日からの年齢計算（満年齢・数え年・次の誕生日・生後日数）や年齢早見表など、年齢に関する各種ツールを提供します。';

const PAGES = [
  {
    href: '/contents/age/calculate',
    label: '生年月日から年齢計算',
    description: '満年齢・数え年・次の誕生日・生後日数を計算',
  },
  {
    href: '/contents/age/chart',
    label: '年齢早見表',
    description: '生まれ年ごとの満年齢・数え年・和暦・干支の一覧表',
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
