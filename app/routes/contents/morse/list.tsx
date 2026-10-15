import { createRoute } from 'honox/factory';

import MorseGrid, { KANA_COLUMNS_CLASS } from '#app/components/morse/morse-grid.js';
import Note from '#app/components/note.js';
import PageHead from '#app/components/page-head.js';
import TocPageLayout, { type TocItem } from '#app/components/toc-page-layout.js';
import TocSection from '#app/components/toc-section.js';
import { NUMERALS } from '#src/domain/morse/numerals.js';
import { OBUN_LETTERS, OBUN_SYMBOLS } from '#src/domain/morse/obun.js';
import { WABUN_KANA_ROWS, WABUN_SIGNS } from '#src/domain/morse/wabun.js';

const PAGE_TITLE = 'モールス信号一覧表 - 和文・欧文・数字・記号';
const META_DESCRIPTION =
  '和文（仮名）と欧文（アルファベット）のモールス信号の一覧表。五十音・濁点・長音・アルファベット・数字・記号のモールス符号と、短点・長点の長さや間隔などの仕組みを紹介します。';
const OG_DESCRIPTION = '和文・欧文・数字・記号のモールス符号の一覧表と、モールス信号の仕組み。';

const SECTIONS = {
  basics: { id: 'basics', label: 'モールス信号の仕組み' },
  wabun: { id: 'wabun', label: '和文' },
  obun: { id: 'obun', label: '欧文' },
  numerals: { id: 'numerals', label: '数字' },
  symbols: { id: 'symbols', label: '欧文の記号' },
} as const satisfies Record<string, TocItem>;

// JSX のテキストを改行で折り返すと日本語の文中に空白が入るため、文字列として持つ
const BASICS = [
  '短点（トン）と長点（ツー）の組み合わせで文字を表します。',
  '長点の長さは短点 3 つ分です。1 つの符号の中の短点・長点の間は短点 1 つ分、文字と文字の間は短点 3 つ分、語と語の間は短点 7 つ分あけます。',
  '欧文（アルファベット）の符号は国際的に決められていて、日本の無線局運用規則にも和文（仮名）の符号とあわせて定められています。',
  '和文と欧文で同じ符号が別の文字を表すことがあります（「・－」は欧文では A、和文ではイ）。',
] as const;

export default createRoute((c) => {
  const url = new URL(c.req.url);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="モールス信号一覧表"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <TocPageLayout title="モールス信号一覧表" tocItems={Object.values(SECTIONS)}>
      <TocSection item={SECTIONS.basics}>
        <ul class="list-disc space-y-1 pl-5 text-sm">
          {BASICS.map((text) => (
            <li>{text}</li>
          ))}
        </ul>
      </TocSection>

      <TocSection item={SECTIONS.wabun}>
        <Note>
          {
            '濁音・半濁音は、仮名の後に濁点・半濁点の符号を続けます（ガ = カ＋濁点）。ャ・ッなどの小さい仮名は、大きい仮名と同じ符号で送ります。'
          }
        </Note>
        <MorseGrid entries={WABUN_KANA_ROWS.flat()} columnsClass={KANA_COLUMNS_CLASS} />
        <MorseGrid entries={WABUN_SIGNS} columnsClass="grid-cols-2 @[34rem]:grid-cols-4" />
      </TocSection>

      <TocSection item={SECTIONS.obun}>
        <Note>大文字と小文字の区別はありません。</Note>
        <MorseGrid
          entries={OBUN_LETTERS}
          columnsClass="grid-cols-3 @[25rem]:grid-cols-4 @[38rem]:grid-cols-6"
        />
      </TocSection>

      <TocSection item={SECTIONS.numerals}>
        <Note>数字の符号は和文・欧文で共通です。</Note>
        <MorseGrid entries={NUMERALS} columnsClass="grid-cols-2 @[43rem]:grid-cols-5" />
      </TocSection>

      <TocSection item={SECTIONS.symbols}>
        <Note>乗算記号（×）は X と同じ符号です。</Note>
        <MorseGrid entries={OBUN_SYMBOLS} columnsClass="grid-cols-2 @[34rem]:grid-cols-4" />
      </TocSection>
    </TocPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
