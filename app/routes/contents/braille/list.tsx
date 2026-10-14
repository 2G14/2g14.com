import type { Child } from 'hono/jsx';
import { createRoute } from 'honox/factory';

import BrailleCells from '#app/components/braille/braille-cells.js';
import BrailleGrid from '#app/components/braille/braille-grid.js';
import PageHead from '#app/components/page-head.js';
import TocPageLayout, { type TocItem } from '#app/components/toc-page-layout.js';
import {
  ALL_DOTS,
  ALPHABET,
  DAKUON_ROWS,
  EXTENDED_KANA,
  NUMERALS,
  PUNCTUATION,
  SEION_ROWS,
  SPECIAL_KANA,
  YOON_ROWS,
} from '#src/domain/braille/braille.js';

const PAGE_TITLE = '点字一覧表 - 五十音・濁音・拗音・特殊音・数字・アルファベット';
const META_DESCRIPTION =
  '日本語の点字（六点点字）の一覧表。五十音・濁音・半濁音・拗音・特殊音・撥音・促音・長音・数字・アルファベット・句読点の点の位置と、点字の仕組みを紹介します。';
const OG_DESCRIPTION =
  '五十音・濁音・拗音・特殊音・数字・アルファベット・句読点の点字一覧表と、点字の仕組み。';

const SECTIONS = {
  basics: { id: 'basics', label: '点字の仕組み' },
  seion: { id: 'seion', label: '五十音' },
  dakuon: { id: 'dakuon', label: '濁音・半濁音' },
  yoon: { id: 'yoon', label: '拗音' },
  extended: { id: 'extended', label: '特殊音' },
  special: { id: 'special', label: '撥音・促音・長音' },
  punctuation: { id: 'punctuation', label: '句読点など' },
  numerals: { id: 'numerals', label: '数字' },
  alphabet: { id: 'alphabet', label: 'アルファベット' },
} as const satisfies Record<string, TocItem>;

// JSX のテキストを改行で折り返すと日本語の文中に空白が入るため、文字列として持つ
const BASICS = [
  '縦 3 点・横 2 列の 6 つの点を 1 マスとし、どの点を盛り上げるかで文字を表します。点には読む面から見て左列の上から 1・2・3、右列の上から 4・5・6 の番号が付いています。',
  '仮名は母音（1・2・4 の点）と子音（3・5・6 の点）の組み合わせでできています（や行・わ行などは例外）。たとえばか行はあ行の形に 6 の点を加えた形です。',
  '濁音・拗音・特殊音・数字・アルファベットは、前に符号（濁点・拗音符・数符・外字符など）を置いて表します。',
  'ひらがなとカタカナの区別はなく、漢字も読みを仮名で書き表します。',
  '発音どおりに書くため、助詞の「は」「へ」は「わ」「え」と書き、「おとうさん」のように伸ばす「う」は長音符で書きます。',
  '言葉の区切りごとにマスをあけて書きます（分かち書き）。',
] as const;

interface SectionProps {
  section: TocItem;
  children: Child;
}

function Section({ section, children }: SectionProps) {
  return (
    <section id={section.id} class="scroll-mt-12">
      <h2 class="sticky top-12 z-20 rounded-xl bg-base-100/70 px-2 py-2 text-xl font-semibold backdrop-blur-md">
        {section.label}
      </h2>
      <div class="card mt-2 bg-base-100 shadow">
        <div class="card-body gap-4">{children}</div>
      </div>
    </section>
  );
}

function Note({ children }: { children: Child }) {
  return <p class="text-sm text-base-content/70">{children}</p>;
}

export default createRoute((c) => {
  const url = new URL(c.req.url);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="点字一覧表"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <TocPageLayout title="点字一覧表" tocItems={Object.values(SECTIONS)}>
      <Section section={SECTIONS.basics}>
        <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div class="flex shrink-0 justify-center">
            <BrailleCells cells={[ALL_DOTS]} size="lg" showDotNumbers />
          </div>
          <ul class="list-disc space-y-1 pl-5 text-sm">
            {BASICS.map((text) => (
              <li>{text}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section section={SECTIONS.seion}>
        <BrailleGrid entries={SEION_ROWS.flat()} columnsClass="grid-cols-5" />
      </Section>

      <Section section={SECTIONS.dakuon}>
        <Note>濁音は濁点（5 の点）、半濁音は半濁点（6 の点）を清音の前に置きます。</Note>
        <BrailleGrid entries={DAKUON_ROWS.flat()} columnsClass="grid-cols-5" />
      </Section>

      <Section section={SECTIONS.yoon}>
        <Note>
          {
            '拗音符（4 の点）の後に、同じ行のア段・ウ段・オ段の仮名を置きます（きゃ = 拗音符＋か）。拗濁音は 4・5 の点、拗半濁音は 4・6 の点を前に置きます。'
          }
        </Note>
        <BrailleGrid entries={YOON_ROWS.flat()} columnsClass="grid-cols-3" />
      </Section>

      <Section section={SECTIONS.extended}>
        <Note>
          {
            '主に外来語に使う音です。拗音符などの前置符号の後に、母音や子音の近い清音を置きます（ティ = 拗音符＋ち、ファ = 合拗音符＋は）。合拗音符は 2・6 の点で、濁音には 2・5・6 の点を使います。'
          }
        </Note>
        <BrailleGrid entries={EXTENDED_KANA} columnsClass="grid-cols-3 sm:grid-cols-6" />
      </Section>

      <Section section={SECTIONS.special}>
        <BrailleGrid entries={SPECIAL_KANA} columnsClass="grid-cols-3" />
      </Section>

      <Section section={SECTIONS.punctuation}>
        <Note>
          {
            '句点・疑問符・感嘆符が文の終わりに来るときは後ろを 2 マス、読点・中点の後ろは 1 マスあけます。'
          }
        </Note>
        <BrailleGrid entries={PUNCTUATION} columnsClass="grid-cols-3 sm:grid-cols-5" />
      </Section>

      <Section section={SECTIONS.numerals}>
        <Note>
          {
            '数字は数符（3・4・5・6 の点）の後に数字の形を続けます。2019 のように数字が続く場合も、数符は先頭に 1 回だけ置きます。'
          }
        </Note>
        <BrailleGrid entries={NUMERALS} columnsClass="grid-cols-3 sm:grid-cols-6" />
      </Section>

      <Section section={SECTIONS.alphabet}>
        <Note>
          {
            '日本語の文中のアルファベットは外字符（5・6 の点）の後に続けます。外字符は数符と同じく先頭に 1 回だけ置き、大文字はその文字の前に大文字符（6 の点）を置きます。'
          }
        </Note>
        <BrailleGrid entries={ALPHABET} columnsClass="grid-cols-4 sm:grid-cols-6" />
      </Section>
    </TocPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
