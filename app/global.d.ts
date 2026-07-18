// 空インポートはファイルをモジュール化し、下の declare module をモジュール拡張として扱わせるため
// oxlint-disable-next-line unicorn/require-module-specifiers
import type {} from 'hono';

declare module 'hono' {
  interface Env {
    Variables: Record<string, never>;
    Bindings: Record<string, never>;
  }
}
