interface PeriodLink {
  href: string;
  label: string;
}

interface PeriodNavProps {
  prev: PeriodLink | null;
  current: string;
  next: PeriodLink | null;
}

/** 前後の年・月へ移るリンク */
export default function PeriodNav({ prev, current, next }: PeriodNavProps) {
  return (
    <nav class="flex items-center justify-between gap-2" aria-label="表示する期間">
      {prev ? (
        <a href={prev.href} class="btn btn-ghost btn-sm">
          ‹ {prev.label}
        </a>
      ) : (
        <span />
      )}
      <span class="text-lg font-semibold">{current}</span>
      {next ? (
        <a href={next.href} class="btn btn-ghost btn-sm">
          {next.label} ›
        </a>
      ) : (
        <span />
      )}
    </nav>
  );
}
