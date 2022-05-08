/**
 * プロパティストア
 * 
 * 参考URL
 * プロパティストアの概要とスクリプトプロパティの入力方法
 * https://tonari-it.com/gas-property-store/
 * 
 * スクリプトプロパティを操作してそのデータを取り出す方法
 * https://tonari-it.com/gas-properties-script-property/
 */

function setScriptProperties() {
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('RECEPTION_BASEURL', 'https://script.google.com/macros/s/**********/exec');
}

function logToken() {
  const token = PropertiesService.getScriptProperties().getProperty('RECEPTION_BASEURL')
  console.log(token);
}