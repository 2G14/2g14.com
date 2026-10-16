import type { TocItem } from '#app/components/toc-page-layout.js';

export const DICE_SECTIONS = {
  summary: { id: 'summary', label: 'まとめ' },
  sum: { id: 'sum', label: '合計の確率' },
  faceCount: { id: 'face-count', label: '特定の目が出る個数' },
} as const satisfies Record<string, TocItem>;
