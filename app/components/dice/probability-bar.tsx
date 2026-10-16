interface ProbabilityBarProps {
  /** 0〜1 の割合 */
  ratio: number;
}

export default function ProbabilityBar({ ratio }: ProbabilityBarProps) {
  return (
    <div class="mt-1 h-1.5 rounded-full bg-base-300" aria-hidden="true">
      <div class="h-full rounded-full bg-primary" style={{ width: `${ratio * 100}%` }} />
    </div>
  );
}
