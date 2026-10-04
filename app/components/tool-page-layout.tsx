import type { Child } from 'hono/jsx';

interface ToolPageLayoutProps {
  title: string;
  headerExtra?: Child;
  children: Child;
}

export default function ToolPageLayout({ title, headerExtra, children }: ToolPageLayoutProps) {
  return (
    <div>
      <header class="navbar sticky top-0 z-30 min-h-12 bg-base-100 shadow-sm">
        <div class="flex-1">
          <h1 class="text-xl font-bold">{title}</h1>
        </div>
        {headerExtra}
      </header>

      <div class="mx-auto my-8 max-w-5xl px-4">{children}</div>
    </div>
  );
}
