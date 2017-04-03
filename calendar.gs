/**
* リソースカレンダー取得
*/
function getCalendarResource(){
  try{
    // adminアカウントのcustomerIdを取得する
    var adminUser = AdminDirectory.Users.get("apps.admin@example.com");
    var customerId = adminUser.customerId;
    
    var calendars = [];
    var pageToken = '';
    
    do{
      var resources = AdminDirectory.Resources.Calendars.list(customerId, {pageToken: pageToken});
      var pageToken = resources.nextPageToken;
      
      var items = resources.items;
      
      for(var i = 0; i < items.length; i++){
        var item = items[i];
        
        calendars.push({
          resourceId: item.resourceId,
          resourceCommonName: item.resourceName,
          resourceEmail : item.resourceEmail,
          resourceDescription : item.resourceDescription ? item.resourceDescription : '',
          resourceType: item.resourceType
        });
      }
    }while(pageToken);
    
    
    // カレンダー名でソート
    calendars.sort(function(a, b){
      if(a.resourceCommonName < b.resourceCommonName){
        return -1;
      }
      else if(a.resourceCommonName > b.resourceCommonName ){
        return 1;
      }
      else{
        return 0;
      }
    });
    
    // スプレッドシートに書き込み。Spreadsheet.gs
    writeSpreadsheet("Calendar", calendars);
    // 内部エラーの場合15分後にトリガーを追加
  }catch(e){
    ScriptApp.newTrigger("getGroups").timeBased().after(1000 * 60 * 15).create();
    throw e;
  }
}