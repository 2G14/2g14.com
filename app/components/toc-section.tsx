import type { Child } from 'hono/jsx';

import type { TocItem } from '#app/components/toc-page-layout.js';

interface TocSectionProps {
  item: TocItem;
  /** 表のように端まで広げる中身のとき、カードの余白をなくす */
  flush?: boolean;
  children: Child;
}

/** TocPageLayout の目次から飛べるよう、見出しを上部に固定したカードのセクション */
export default function TocSection({ item, flush = false, children }: TocSectionProps) {
  return (
    <section id={item.id} class="scroll-mt-12">
      <h2 class="sticky top-12 z-20 rounded-xl bg-base-100/70 px-2 py-2 text-xl font-semibold backdrop-blur-md">
        {item.label}
      </h2>
      <div class="card mt-2 bg-base-100 shadow">
        <div class={`card-body ${flush ? 'p-0' : 'gap-4'}`}>{children}</div>
      </div>
    </section>
  );
}
