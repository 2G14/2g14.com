import { createRoute } from 'honox/factory';

// 西暦から和暦への変換ページ
// 年月日の入力に対して、対応する和暦を表示する。
// クエリパラメータ: ?year=2024&month=6&day=1

export default createRoute((c) => {
  return c.render(<div />, { title: '西暦→和暦 変換' });
});
