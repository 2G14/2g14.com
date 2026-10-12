import { createSeireki, type Seireki } from '../date/seireki.js';

type SchoolStage = 'kindergarten' | 'elementary' | 'juniorHigh' | 'highSchool' | 'university';

interface StageDefinition {
  readonly stage: SchoolStage;
  readonly name: string;
  /** 学年の表記に付ける接頭辞（「小学3年生」の「小学」） */
  readonly gradePrefix: string;
  readonly years: number;
  /** 小学校 1 年の年度から何年度ずれて始まるか */
  readonly offset: number;
}

/** 幼稚園は 3 年保育、大学は 4 年制で、浪人・留年なく進む前提 */
const STAGES = [
  { stage: 'kindergarten', name: '幼稚園', gradePrefix: '', years: 3, offset: -3 },
  { stage: 'elementary', name: '小学校', gradePrefix: '小学', years: 6, offset: 0 },
  { stage: 'juniorHigh', name: '中学校', gradePrefix: '中学', years: 3, offset: 6 },
  { stage: 'highSchool', name: '高校', gradePrefix: '高校', years: 3, offset: 9 },
  { stage: 'university', name: '大学', gradePrefix: '大学', years: 4, offset: 12 },
] as const satisfies readonly StageDefinition[];

const KINDERGARTEN_GRADE_LABELS = ['年少', '年中', '年長'] as const;

export interface Grade {
  readonly stage: SchoolStage;
  readonly stageName: string;
  /** その学校の何年生か（1 始まり） */
  readonly grade: number;
  /** 「小学3年生」「年中」など */
  readonly label: string;
}

export interface SchoolPeriod {
  readonly stage: SchoolStage;
  readonly name: string;
  /** 入学する年（4 月） */
  readonly entryYear: number;
  /** 卒業する年（3 月） */
  readonly graduationYear: number;
}

export class InvalidSchoolYearError extends Error {
  constructor(message: string = '無効な年度です') {
    super(message);
    this.name = 'InvalidSchoolYearError';
    Object.setPrototypeOf(this, InvalidSchoolYearError.prototype);
  }
}

export interface BirthDateRange {
  readonly from: Seireki;
  readonly to: Seireki;
}

/** 4 月 1 日から翌年 3 月 31 日までを、始まりの年で表した年度 */
export function schoolYearOf(date: Seireki): number {
  return date.month >= 4 ? date.year : date.year - 1;
}

/**
 * 小学校に入学する年度。
 * 学校教育法は満 6 歳に達した日の翌日以後の最初の 4 月 1 日から就学させるとし、
 * 年齢計算ニ関スル法律により満 6 歳に達するのは誕生日の前日なので、
 * 4 月 1 日生まれまでが前の学年（早生まれ）に入る。
 */
export function elementaryEntryYear(birth: Seireki): number {
  const bornByApril1 = birth.month < 4 || (birth.month === 4 && birth.day === 1);
  return birth.year + (bornByApril1 ? 6 : 7);
}

function toGrade(stage: StageDefinition, grade: number): Grade {
  const label =
    stage.stage === 'kindergarten'
      ? (KINDERGARTEN_GRADE_LABELS[grade - 1] ?? '')
      : `${stage.gradePrefix}${grade}年生`;
  return { stage: stage.stage, stageName: stage.name, grade, label };
}

/**
 * 指定した日の学年。幼稚園に入る前と大学を卒業した後は null。
 */
export function gradeOn(birth: Seireki, date: Seireki): Grade | null {
  // 小学 1 年を 1 とした通し番号
  const serial = schoolYearOf(date) - elementaryEntryYear(birth) + 1;
  const stage = STAGES.find((s) => serial > s.offset && serial <= s.offset + s.years);
  if (!stage) return null;

  return toGrade(stage, serial - stage.offset);
}

/**
 * 幼稚園の入園から大学の卒業までの入学・卒業の年。
 */
export function schoolTimeline(birth: Seireki): SchoolPeriod[] {
  const entry = elementaryEntryYear(birth);
  return STAGES.map((s) => ({
    stage: s.stage,
    name: s.name,
    entryYear: entry + s.offset,
    graduationYear: entry + s.offset + s.years,
  }));
}

/**
 * 指定した年度に各学年に在籍する人の生年月日の範囲（4 月 2 日〜翌年 4 月 1 日）。
 * 幼稚園の年少から大学 4 年まで、学年の低い順に並べる。
 */
export function birthDateRangesInSchoolYear(
  schoolYear: number,
): { grade: Grade; range: BirthDateRange }[] {
  if (!Number.isSafeInteger(schoolYear)) {
    throw new InvalidSchoolYearError(`年度は安全な整数である必要があります: ${schoolYear}`);
  }

  return STAGES.flatMap((stage) =>
    Array.from({ length: stage.years }, (_, i) => {
      const grade = i + 1;
      const entry = schoolYear - stage.offset - grade + 1;
      return {
        grade: toGrade(stage, grade),
        range: {
          from: createSeireki({ year: entry - 7, month: 4, day: 2 }),
          to: createSeireki({ year: entry - 6, month: 4, day: 1 }),
        },
      };
    }),
  );
}
