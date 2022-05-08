/**
 * 出欠状況（登録済かどうか）を画面に表示する。
 * 出席管理シートには、QRを最初に読み込んだ時の日時を反映する。
 * doGetシートには、毎回のQRを読み込んだ時の日時を反映する（一つのQRコードを何度も読み込んだ場合、同一IDのログが残る）
 * @param {object} e イベントオブジェクト
 * @return {string}出欠状況（登録済がどうか）を画面に表示する
 */

function doGet(e) {

  console.log(e)

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const id = e.parameter.id;
  const time = Utilities.formatDate(new Date(), 'JST', 'yyyy/MM/dd HH:mm:ss aaa');

  const recordSHT = ss.getSheetByName('doGet');
  const recordVAL = [id, time];
  recordSHT.appendRow(recordVAL);

  const answerSHT = ss.getSheetByName('出席管理');
  const asnwerRNG = answerSHT.getDataRange();
  const answerVALS = asnwerRNG.getValues();
  const idCOL = answerVALS[0].indexOf('ID');
  const attendCOL = answerVALS[0].indexOf('出席');
  const nameCOL = answerVALS[0].indexOf('氏名');

  let textOutput = msgTextGet();//msgTextGet関数からテキスト本文を呼び出し

  for (const answer of answerVALS) {
    //IDがヒットした時だけ処理する
    if (answer[idCOL] === id) {
      textOutput = textOutput
        .replace(/{{id}}/, answer[idCOL])
        .replace(/{{氏名}}/, answer[nameCOL]);

      //まだ出席登録されていない
      if (!answer[attendCOL]) {
        answer[attendCOL] = time;
        textOutput = textOutput
          .replace(/{{本文}}/, '出欠登録を受け付けました。')
          .replace(/{{時刻}}/, time);

        //すでに出席登録されている 
      } else {
        textOutput = textOutput
          .replace(/{{本文}}/, '出欠登録は受付済みです')
          .replace(/{{時刻}}/, `(初回受付)${answer[attendCOL]}`);
        // .replace(/{{時刻}}/, `(初回受付)${Utilities.formatDate(answer[attendCOL], 'JST', 'yyyy/MM/dd HH:mm:ss aaa')}`);
      }
      break;
    }
  }

  asnwerRNG.setValues(answerVALS);

  return ContentService.createTextOutput(textOutput);
}


/**
 * 画面に表示するテキスト本文を生成する。
 * @return {string}テキスト
 */

function msgTextGet() {

  const textOutput = `
ご来場ありがとうございます！

{{本文}}
ID：{{id}}
氏名：{{氏名}}
時刻：{{時刻}}
`;

  return textOutput;
}