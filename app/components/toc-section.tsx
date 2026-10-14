import type { Child } from 'hono/jsx';

import type { TocItem } from '#app/components/toc-page-layout.js';

interface TocSectionProps {
  section: TocItem;
  children: Child;
}

/** TocPageLayout の目次から飛べるよう、見出しを上部に固定したカードのセクション */
export default function TocSection({ section, children }: TocSectionProps) {
  return (
    <section id={section.id} class="scroll-mt-12">
      <h2 class="sticky top-12 z-20 rounded-xl bg-base-100/70 px-2 py-2 text-xl font-semibold backdrop-blur-md">
        {section.label}
      </h2>
      <div class="card mt-2 bg-base-100 shadow">
        <div class="card-body gap-4">{children}</div>
      </div>
    </section>
  );
}
