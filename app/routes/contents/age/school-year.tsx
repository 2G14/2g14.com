import { createRoute } from 'honox/factory';

import PageHead from '#app/components/page-head.js';
import ToolPageLayout from '#app/components/tool-page-layout.js';
import SchoolYearLookup from '#app/islands/age/school-year-lookup.js';
import { formatSeireki } from '#src/domain/date/format.js';
import { createSeireki } from '#src/domain/date/seireki.js';
import { birthDateRangesInSchoolYear, schoolYearOf } from '#src/domain/school/school-year.js';
import { seirekiToWareki } from '#src/domain/wareki/conversion.js';
import { formatWareki } from '#src/domain/wareki/format.js';
import { todayInJST } from '#src/lib/date.js';

const PAGE_TITLE = '学年早見表 - 生年月日から学年と入学・卒業の年を調べる';
const META_DESCRIPTION =
  '今年度の幼稚園・小学校・中学校・高校・大学の各学年に当たる生年月日の早見表。生年月日を入力すると、今年度の学年と入学・卒業の年もわかります。';
const OG_DESCRIPTION = '学年ごとの生年月日の早見表と、生年月日から入学・卒業の年を調べるツール。';

export default createRoute((c) => {
  const url = new URL(c.req.url);
  const schoolYear = schoolYearOf(createSeireki(todayInJST()));
  const rows = birthDateRangesInSchoolYear(schoolYear);

  const head = (
    <PageHead
      url={url.href}
      title={PAGE_TITLE}
      description={META_DESCRIPTION}
      ogTitle="学年早見表"
      ogDescription={OG_DESCRIPTION}
    />
  );

  return c.render(
    <ToolPageLayout title="学年早見表">
      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <SchoolYearLookup
          initialYear={c.req.query('year')}
          initialMonth={c.req.query('month')}
          initialDay={c.req.query('day')}
        />

        <section class="card bg-base-100 shadow">
          <div class="card-body">
            <h2 class="card-title">{schoolYear}年度の学年早見表</h2>
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <caption class="sr-only">{schoolYear}年度の学年ごとの生年月日</caption>
                <thead>
                  <tr>
                    <th>学年</th>
                    <th>生年月日</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ grade, range }) => {
                    const from = seirekiToWareki(range.from);
                    const to = seirekiToWareki(range.to);
                    return (
                      <tr>
                        <th class="whitespace-nowrap">{grade.label}</th>
                        <td>
                          <p>
                            {formatSeireki(range.from)}〜{formatSeireki(range.to)}
                          </p>
                          {from && to && (
                            <p class="text-xs text-base-content/60">
                              {formatWareki(from)}〜{formatWareki(to)}
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <p class="text-xs text-base-content/50 lg:col-span-2">
          ※ 法律上は誕生日の前日に年をとるため、4 月 1 日生まれは早生まれとして 1
          つ上の学年に入ります。幼稚園は 3 年保育、大学は 4 年制で、浪人・留年をしない場合の年です。
        </p>
      </div>
    </ToolPageLayout>,
    { title: PAGE_TITLE, head },
  );
});
