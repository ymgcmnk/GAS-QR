/**
 * フォーム回答時にトリガ発火。
 * @param {object} e イベントオブジェクト
 * @return {Array} フォームの回答とIDの配列
 */

function retrieveFormAnswer(e) {

  const sheet = e.source.getActiveSheet();
  console.log(e);
  console.log(sheet.getName());

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const answerSHT = ss.getSheetByName('出席管理');  // const originalSHT = ss.getSheetByName('フォームの回答 1');
  const today = Utilities.formatDate(new Date(), 'JST', 'yyyyMMdd');

  e.id = idCreator(e, 3, today);  //IDを作成して、イベントオブジェクトに追加
  e.receptionUrl = createReceptionUrl(e);  //受付用URLを生成して、イベントオブジェクトに追加
  e.qrcode = createQrBlob(e.receptionUrl);  //QRBlobを生成して、イベントオブジェクトに追加

  sendEmail(e);  //メールを送信

  //IDをフォームの回答 1　スプレッドシートに記録　　
  // e.range.getCell(1, 1).offset(0, -1).setValue(e.id); //A列に記録
  //NOTE: 範囲→単一セルを選択する方法　Range.getCell(相対行,相対列) 範囲外の場合はoffset()
  //NOTE: 同じく　Range.getNextDataCell(SpreadsheetApp.Direction.PREVIOUS)　でも動く、けど、getCellのほうが多分動作が軽い（スプシ読む必要無いので）
  //NOTE: https://caymezon.com/gas-cell-range/#toc2

  const array = e.values;
  array.push(e.id);
  answerSHT.appendRow(array); //出席管理　スプレッドシートに記録　転記
  SpreadsheetApp.flush(); 

}

/**
 * idCreator　ファンクション：新規データのIDを作成する（e.range.rowStartでもいいけど、ちょっと遊びを）
 * @param {object} e フォーム回答イベントのイベントオブジェクト
 * @param {number} len　IDの長さ 初期値３、１→上限26個、２→上限676個、３→上限17,576個、４→上限456,976個、５→上限11,881,376個
 * @param {string} prefix IDの接頭文字を指定する
 * @param {string} surfix IDの接尾文字を指定
 * @return {string} id 完成したID 
 */
function idCreator(e, len = 3, prefix = "", surfix = "") {//仮引数prefix は、「デフォルト値」。e.id = idCreator(e, 3, today)でtodayを渡されると　prefixはtodayになります。

  const count = e.range.rowStart - 1;

  if (count > 26 ** len) throw `count[${count}]は、IDの長さ[${len}]で作成可能な上限[${26 ** len}]を超えています。`;  //ID上限チェック

  let id = "";
  for (let i = len; i > 0; i--) {
    id += String.fromCharCode(Math.floor((count - 1) % (26 ** i) / 26 ** (i - 1)) + 65);　//65=A　Aから始まるように
  }
  id = prefix + id + surfix;
  return id;
}

/**
 * createQrBlob イベントオブジェクトから、QRコードを生成してBLOBを返す
 * @param {object} e イベントオブジェクト
 * @return {blob} QRコードのBlob
 */
function createQrBlob(data) {

  const qrCreateURL = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURI(data)}`;
  const option = {
    method: 'get',
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(qrCreateURL, option);
  return response.getBlob().setName('QRコード.png');
}

/**
 * フォームの回答から、受付用URLを生成する
 * @param {object} e イベントオブジェクト
 * @return {string} url 受付用URL 
 */
function createReceptionUrl(e) {

  const baseUrl = PropertiesService.getScriptProperties().getProperty('RECEPTION_BASEURL');
  return `${baseUrl}?id=${e.id}`;
}

/**
 * イベントオブジェクトからメールを送信する
 * @param {object} e イベントオブジェクト
 */
function sendEmail(e) {

  const refUrl = 'https://www......';
  
  //HTMLメールが表示出来ない場合の代替本文を作成
  const bodyTemplate = `
   ${e.namedValues['氏名']} 様

   この度は　受付フォーム　にご回答いただきありがとうございます。

   あなたの受付番号は「${e.id}」です。

   当日のイベントについては、こちらのURLをご覧ください: 
   ${refUrl}

   添付ファイルのQRコードを受付でご提示下さい。

   会社名　xxxx
   イベントurl　xxxx
   メールアドレス　xxxx
  `;

  const recipient = e.namedValues['メールアドレス']
  const subject = 'xxxに登録されました';
  const inlineImageCode = "<strong>イベント当日は、このQRコードを受付に提示してください。<strong><br><img src='cid:inlineImg'>";
  const htmlBody = bodyTemplate.replace(/[\r\n]/g, '<br>')
    .replace('添付ファイルのQRコードを受付でご提示下さい。', inlineImageCode);//htmlに置き換え
  const options = {
    htmlBody: htmlBody,
    inlineImages: {
      inlineImg: e.qrcode
    },
    attachments: e.qrcode
  };

  // ランダムでスリープかける。同時申込でメール送信できない現象回避のため。
  const max = 30;
  const min = 0;
  const staySecond = Math.floor(Math.random() * (max - min + 1) + min);
  Utilities.sleep(staySecond * 1000);

  //メール送信
  GmailApp.sendEmail(recipient, subject, bodyTemplate, options)

}
