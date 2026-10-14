import type { Child } from 'hono/jsx';

interface NoteProps {
  children: Child;
}

/** 表や結果に添える補足の文 */
export default function Note({ children }: NoteProps) {
  return <p class="text-sm text-base-content/70">{children}</p>;
}
