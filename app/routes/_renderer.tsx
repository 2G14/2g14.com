import type { Child } from 'hono/jsx';
import { jsxRenderer } from 'hono/jsx-renderer';
import { Link, Script } from 'honox/server';

declare module 'hono' {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      props: { title?: string; head?: Child },
    ): Response | Promise<Response>;
  }
}

export default jsxRenderer(({ children, title, head }) => {
  return (
    <html lang="ja" data-theme="light">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" href="/favicon.ico" />
        {title && <title>{title}</title>}
        {head}
        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
      </head>
      <body class="antialiased">{children}</body>
    </html>
  );
});
