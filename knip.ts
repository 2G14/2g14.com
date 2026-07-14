import type { KnipConfig } from 'knip';

export default {
  entry: ['app/server.ts', 'app/client.ts', 'app/routes/**/*.{ts,tsx}', 'app/style.css'],
  project: ['app/**/*.{ts,tsx,css}', 'src/**/*.ts'],
  compilers: {
    // CSS の @import / @plugin は knip が解釈できないため import 文へ変換する
    css: (text: string) =>
      [...text.matchAll(/@(?:import|plugin)\s+['"]([^'"]+)['"]/g)]
        .map(([, id]) => `import '${id}';`)
        .join('\n'),
  },
} satisfies KnipConfig;
