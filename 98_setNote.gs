// /**
//  * trigger　編集時
//  * 編集したセルに最終更新日時と前回の値をメモとして残す
// */

// function setNote(e) {

//   const range = e.range; // 編集したセル
//   const oldvalue = e.oldValue; // 前回の値
//   const user  = e.user;

//   const lastModifiedDate= new Date(); //　最終更新日時
//   const strlastModifiedDate = Utilities.formatDate(lastModifiedDate, "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");//　最終更新日時 書式変換


//   let msg = '';
//   msg += `最終更新日時: ${strlastModifiedDate}\n\n`;
//   msg += `編集前のセルの値: ${oldvalue}\n\n`;
//   msg += `編集したユーザ: ${user}`;

//   range.setNote(msg);　// メモとしてmsgを残す
// }
