import { describe, expect, it } from 'vitest';

import {
  dateInputQueryString,
  dateParamString,
  dateParamValue,
  dateQueryString,
  dateToolUrl,
  initialDateParam,
  initialNumberParam,
  numberParamValue,
  parseDateParam,
  parseQueryNumber,
  yearQueryString,
} from './date-query.js';

describe('parseQueryNumber', () => {
  it('整数の文字列を数値にする', () => {
    expect(parseQueryNumber('2026')).toBe(2026);
  });

  it('クエリに無ければ null を返す', () => {
    expect(parseQueryNumber()).toBeNull();
    expect(parseQueryNumber('')).toBeNull();
  });

  it('整数として読めない値は null を返す', () => {
    expect(parseQueryNumber('abc')).toBeNull();
    expect(parseQueryNumber('7.5')).toBeNull();
  });
});

describe('dateQueryString', () => {
  it('年月日をクエリ文字列にする', () => {
    expect(dateQueryString({ year: 2026, month: 7, day: 17 })).toBe('year=2026&month=7&day=17');
  });

  it('元号があれば era を含める', () => {
    expect(dateQueryString({ era: '令和', year: 8, month: 7, day: 17 })).toBe(
      `era=${encodeURIComponent('令和')}&year=8&month=7&day=17`,
    );
  });

  it('月・日が 1 でも省略しない', () => {
    expect(dateQueryString({ year: 2026, month: 1, day: 1 })).toBe('year=2026&month=1&day=1');
  });

  it('読み戻せる値だけを受け取る', () => {
    const qs = dateQueryString({ year: 2026, month: 1, day: 1 });
    const params = new URLSearchParams(qs);
    expect({
      year: parseQueryNumber(params.get('year') ?? undefined),
      month: parseQueryNumber(params.get('month') ?? undefined),
      day: parseQueryNumber(params.get('day') ?? undefined),
    }).toEqual({ year: 2026, month: 1, day: 1 });
  });
});

describe('dateToolUrl', () => {
  it('値があればクエリ付き URL を返す', () => {
    expect(dateToolUrl('/base', { year: 2026, month: 7, day: 17 })).toBe(
      '/base?year=2026&month=7&day=17',
    );
  });

  it('値が null なら base をそのまま返す', () => {
    expect(dateToolUrl('/base', null)).toBe('/base');
  });
});

describe('yearQueryString', () => {
  it('整数の年を year クエリにする', () => {
    expect(yearQueryString(1985)).toBe('year=1985');
  });

  it('空欄ならクエリを消すため空文字を返す', () => {
    expect(yearQueryString(null)).toBe('');
  });

  it('整数でなければ URL を変えないため null を返す', () => {
    expect(yearQueryString(1985.5)).toBeNull();
  });
});

describe('dateInputQueryString', () => {
  it('年月日がそろえば year/month/day クエリにする', () => {
    expect(dateInputQueryString({ year: 2019, month: 4, day: 2 })).toBe('year=2019&month=4&day=2');
  });

  it('欠けた欄があればクエリを消すため空文字を返す', () => {
    expect(dateInputQueryString({ year: 2019, month: 4, day: null })).toBe('');
    expect(dateInputQueryString({ year: null, month: null, day: null })).toBe('');
  });

  it('整数でない値があれば URL を変えないため null を返す', () => {
    expect(dateInputQueryString({ year: 2019, month: 4.5, day: null })).toBeNull();
  });
});

describe('dateParamString', () => {
  it('年月日をゼロ埋めした YYYY-MM-DD にする', () => {
    expect(dateParamString({ year: 2026, month: 7, day: 1 })).toBe('2026-07-01');
    expect(dateParamString({ year: 1, month: 1, day: 1 })).toBe('0001-01-01');
  });
});

describe('parseDateParam', () => {
  it('YYYY-MM-DD を年月日にする', () => {
    expect(parseDateParam('2026-07-01')).toEqual({ year: 2026, month: 7, day: 1 });
  });

  it('範囲外や存在しない日付も、書き出した値をそのまま読み戻す', () => {
    for (const values of [
      { year: 10000, month: 1, day: 1 },
      { year: 0, month: 13, day: 0 },
      { year: -1, month: -2, day: 32 },
    ]) {
      expect(parseDateParam(dateParamString(values))).toEqual(values);
    }
  });

  it('クエリに無い、または形式が違えば null を返す', () => {
    expect(parseDateParam()).toBeNull();
    expect(parseDateParam('20260701')).toBeNull();
    expect(parseDateParam('2026-07-01x')).toBeNull();
  });
});

describe('dateParamValue', () => {
  it('年月日がそろえば YYYY-MM-DD にする', () => {
    expect(dateParamValue({ year: 2026, month: 10, day: 12 })).toBe('2026-10-12');
  });

  it('欠けた欄があれば空文字を返す', () => {
    expect(dateParamValue({ year: 2026, month: null, day: null })).toBe('');
  });

  it('整数でない値があれば URL を変えないため null を返す', () => {
    expect(dateParamValue({ year: 2026, month: 1.5, day: null })).toBeNull();
  });
});

describe('initialDateParam', () => {
  const today = { year: 2026, month: 10, day: 12 };

  it('クエリが無ければ fallback を返す', () => {
    expect(initialDateParam(undefined, today)).toBe(today);
  });

  it('日付が載っていればその日付を返す', () => {
    expect(initialDateParam('2026-12-25', today)).toEqual({ year: 2026, month: 12, day: 25 });
  });

  it('空や読めない値なら未入力を返す', () => {
    const empty = { year: null, month: null, day: null };
    expect(initialDateParam('', today)).toEqual(empty);
    expect(initialDateParam('abc', today)).toEqual(empty);
  });
});

describe('numberParamValue', () => {
  it('整数はそのまま、空欄は空文字、整数でなければ null を返す', () => {
    expect(numberParamValue(100)).toBe('100');
    expect(numberParamValue(null)).toBe('');
    expect(numberParamValue(1.5)).toBeNull();
  });
});

describe('initialNumberParam', () => {
  it('クエリが無ければ fallback、空や読めない値なら null を返す', () => {
    expect(initialNumberParam(undefined, 100)).toBe(100);
    expect(initialNumberParam('-30', 100)).toBe(-30);
    expect(initialNumberParam('', 100)).toBeNull();
    expect(initialNumberParam('abc', 100)).toBeNull();
  });
});
