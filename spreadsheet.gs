/**
* スプレッドシートへ書き込み
*/
function writeSpreadsheet(sheetName, items){
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  sheet.clear();
  
  var indexRow = [];
  for(var attr in items[0]){
    indexRow.push(attr);
  }
  
  Logger.log(items);
  
  sheet.appendRow(indexRow);
  var rows = [];
  for(var i = 0; i < items.length; i++){
    var row = new Array();
    for(var attr in items[i]){
      row.push(items[i][attr]);
    }
    rows.push(row);
    //sheet.appendRow(row);
  }
  var rowCount = rows.length;
  var columnCount = indexRow.length;
  sheet.getRange(2, 1, rowCount, columnCount).setValues(rows);
  
  sheet.setFrozenRows(1);
}