import type { Child } from 'hono/jsx';

import ToolPageLayout from '#app/components/tool-page-layout.js';

export interface TocItem {
  /** 見出しを含む section の id */
  id: string;
  label: string;
}

interface TocPageLayoutProps {
  title: string;
  tocItems: readonly TocItem[];
  children: Child;
}

/** セクションの多いページ向けに、PC では右サイドバー、スマホではドロワーで目次を出す */
export default function TocPageLayout({ title, tocItems, children }: TocPageLayoutProps) {
  return (
    <>
      <ToolPageLayout
        title={title}
        headerExtra={
          <div class="flex-none md:hidden">
            <button type="button" popovertarget="toc-drawer" class="btn btn-ghost btn-sm">
              目次
            </button>
          </div>
        }
      >
        <div class="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_200px]">
          <main class="grid min-w-0 grid-cols-1 items-start gap-8">{children}</main>

          <aside class="hidden max-h-[calc(100vh-4rem)] w-48 self-start overflow-auto md:sticky md:top-24 md:block">
            <nav aria-label="目次">
              <ul class="menu menu-sm">
                {tocItems.map((item) => (
                  <li>
                    <a href={`#${item.id}`}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </ToolPageLayout>

      {/* daisyUI の drawer は checkbox + label で組まれ、トグルが button role を持てないため
          Popover API で組む。Esc・外側クリックでの close と aria-expanded はブラウザが担う。
          popover を真偽値で書くと Hono が popover="true" を出力し、無効値として manual 扱いになる */}
      <nav
        id="toc-drawer"
        popover="auto"
        aria-label="目次(ドロワー)"
        class="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-64 translate-x-full border-0 bg-base-100 p-0 text-base-content transition-all transition-discrete duration-300 backdrop:bg-black/40 open:translate-x-0 starting:open:translate-x-full"
      >
        <div class="flex items-center justify-between border-b border-base-300 px-4 py-3">
          <h2 class="text-lg font-semibold">目次</h2>
          <button
            type="button"
            popovertarget="toc-drawer"
            popovertargetaction="hide"
            aria-label="目次を閉じる"
            class="btn btn-circle btn-ghost btn-sm"
          >
            &times;
          </button>
        </div>
        <ul class="menu w-full">
          {tocItems.map((item) => (
            <li>
              <a href={`#${item.id}`} onclick="document.getElementById('toc-drawer').hidePopover()">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
