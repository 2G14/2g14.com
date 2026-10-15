/** 短点（トン）と長点（ツー） */
type MorseSignal = 'dot' | 'dash';

const brand = Symbol('MorseCode');

/** 1 文字（または記号 1 つ）を表すモールス符号 */
export interface MorseCode {
  readonly [brand]: unknown;
  readonly signals: readonly MorseSignal[];
}

export class InvalidMorseCodeError extends Error {
  constructor(message: string = '無効なモールス符号です') {
    super(message);
    this.name = 'InvalidMorseCodeError';
    Object.setPrototypeOf(this, InvalidMorseCodeError.prototype);
  }
}

/** 表を符号の見た目のまま書けるよう、短点を「.」、長点を「-」とした文字列から作る */
export function createMorseCode(pattern: string): MorseCode {
  if (!/^[.-]+$/u.test(pattern)) {
    throw new InvalidMorseCodeError(
      `符号は「.」と「-」を 1 つ以上並べた文字列である必要があります: ${pattern}`,
    );
  }
  const signals: readonly MorseSignal[] = [...pattern].map((char) =>
    char === '.' ? 'dot' : 'dash',
  );
  return { signals } as MorseCode;
}

/** 日本の法令（無線局運用規則）の表と同じく、短点を「・」、長点を「－」で書く */
export function morseCodeToText(code: MorseCode): string {
  return code.signals.map((signal) => (signal === 'dot' ? '・' : '－')).join('');
}

/** 読み上げ用に、短点を「トン」、長点を「ツー」と読む */
export function morseCodeReading(code: MorseCode): string {
  return code.signals.map((signal) => (signal === 'dot' ? 'トン' : 'ツー')).join(' ');
}
