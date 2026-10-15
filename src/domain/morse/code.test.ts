import { describe, expect, it } from 'vitest';

import {
  createMorseCode,
  InvalidMorseCodeError,
  morseCodeReading,
  morseCodeToText,
} from '#src/domain/morse/code.js';

describe('createMorseCode', () => {
  it('「.」を短点、「-」を長点とした符号を作る', () => {
    expect(createMorseCode('.-').signals).toEqual(['dot', 'dash']);
  });

  it.each(['', 'a', '. -', '・－'])(
    '「.」「-」以外を含む %j は InvalidMorseCodeError',
    (pattern) => {
      expect(() => createMorseCode(pattern)).toThrow(InvalidMorseCodeError);
    },
  );
});

describe('morseCodeToText', () => {
  it('短点を「・」、長点を「－」で書く', () => {
    expect(morseCodeToText(createMorseCode('-.--.-'))).toBe('－・－－・－');
  });
});

describe('morseCodeReading', () => {
  it('短点を「トン」、長点を「ツー」と読む', () => {
    expect(morseCodeReading(createMorseCode('.-.'))).toBe('トン ツー トン');
  });
});
