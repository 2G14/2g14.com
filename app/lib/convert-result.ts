import { type DateQueryValues, dateToolUrl } from './date-query.js';

export type ConvertResult =
  | { text: string; reverseQuery: DateQueryValues }
  | { error: string }
  | null;

export function reverseToolUrl(base: string, result: ConvertResult): string {
  return dateToolUrl(base, result && 'reverseQuery' in result ? result.reverseQuery : null);
}
