import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';

const PAGE_TITLE = '干支ツール';
const META_DESCRIPTION =
  '今年の干支の表示、生まれ年の干支検索、十二支・六十干支の一覧表など、干支（十干十二支）に関する各種ツールを提供します。';

const PAGES = [
  {
    href: '/contents/eto/this-year',
    label: '今年の干支',
    description: '今年の十二支と十干十二支を表示',
  },
  {
    href: '/contents/eto/search-by-year',
    label: '生まれ年の干支検索',
    description: '西暦年を入力してその年の干支を表示',
  },
  {
    href: '/contents/eto/list',
    label: '干支一覧表',
    description: '十二支と六十干支の一覧表',
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
