function test() {
  const e = {
    namedValues:
    {
      'メールアドレス': ['XXX@gmail.com'],
      'メールアドレスの登録': ['XXX@gmail.com'],
      'テストオプション': ['選択肢 1'],
      'タイムスタンプ': ['2021/11/28 20:59:05'],
      '氏名': ['テスト太郎']
    },
    range: { columnEnd: 4, columnStart: 1, rowEnd: 3, rowStart: 3 },
    source: {},
    triggerUid: '9187333',
    values:
      ['2021/11/28 20:59:05',
        'XXX@gmail.com',
        '選択肢 1',
        'XXX@gmail.com',
        'テスト太郎']
  }
  // const name = e.namedValues['氏名'];
  // console.log(name);
  retrieveFormAnswer(e);
}

function test2(e) {
  const sheet = e.source.getActiveSheet();
  console.log(sheet.getName());
}
