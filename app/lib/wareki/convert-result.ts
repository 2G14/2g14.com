import { type DateQueryValues, dateToolUrl } from '../date-query.js';
import type { NoResult } from '../result.js';

export type ConvertResult = NoResult | { kind: 'ok'; text: string; reverseQuery: DateQueryValues };

export function reverseToolUrl(base: string, result: ConvertResult): string {
  return dateToolUrl(base, result.kind === 'ok' ? result.reverseQuery : null);
}
