import { describe, expect, it } from 'vitest';

import { morseCodeToText } from '#src/domain/morse/code.js';
import { NUMERALS } from '#src/domain/morse/numerals.js';

describe('NUMERALS', () => {
  it('1〜9・0 の符号', () => {
    expect(NUMERALS.map((entry) => `${entry.label}${morseCodeToText(entry.code)}`)).toEqual([
      '1・－－－－',
      '2・・－－－',
      '3・・・－－',
      '4・・・・－',
      '5・・・・・',
      '6－・・・・',
      '7－－・・・',
      '8－－－・・',
      '9－－－－・',
      '0－－－－－',
    ]);
  });
});
