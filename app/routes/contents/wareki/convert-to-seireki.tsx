import { createRoute } from 'honox/factory';

// 和暦から西暦への変換ページ
// 元号を選択し、年月日を入力することで、対応する西暦を表示する。
// クエリパラメータ: ?era=令和&year=6&month=6&day=1

export default createRoute((c) => {
  return c.render(<div />, { title: '和暦→西暦 変換' });
});
