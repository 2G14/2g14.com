import ToolPageLayout from './tool-page-layout.js';

interface ToolLink {
  href: string;
  label: string;
  description: string;
}

interface ToolIndexProps {
  title: string;
  pages: readonly ToolLink[];
}

export default function ToolIndex({ title, pages }: ToolIndexProps) {
  return (
    <ToolPageLayout title={title}>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {pages.map((page) => (
          <a href={page.href} class="card bg-base-100 shadow transition-shadow hover:shadow-md">
            <div class="card-body p-4">
              <h2 class="card-title text-base">{page.label}</h2>
              <p class="text-sm text-base-content/60">{page.description}</p>
            </div>
          </a>
        ))}
      </div>
    </ToolPageLayout>
  );
}
