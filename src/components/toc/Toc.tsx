function anchorId(name: string) {
  return name.replace(/\s+/g, '-');
}

export interface TocProps {
  readonly items: readonly string[];
}

export default function Toc({ items }: TocProps) {
  return (
    <nav className="flex flex-col gap-1 p-2 [scroll-target-group:auto]">
      {items.map((item) => (
        <a
          key={item}
          className="era-link block px-3 py-1 rounded-md text-sm text-slate-700 hover:bg-slate-100 [&:target-current]:font-bold [&:target-current]:bg-gray-100"
          href={`#${anchorId(item)}`}
        >
          {item}
        </a>
      ))}
    </nav>
  );
}
