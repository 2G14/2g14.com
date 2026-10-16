import type { Child } from 'hono/jsx';

interface StatTileProps {
  title: string;
  value: Child;
  description?: Child;
}

export default function StatTile({ title, value, description }: StatTileProps) {
  return (
    <div class="rounded-box bg-base-200 px-4 py-3">
      <div class="text-xs text-base-content/60">{title}</div>
      <div class="mt-1 text-2xl font-bold tabular-nums">{value}</div>
      {description !== undefined && (
        <div class="mt-0.5 text-xs text-base-content/60 tabular-nums">{description}</div>
      )}
    </div>
  );
}
