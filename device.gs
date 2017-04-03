/**
* モバイルデバイス一覧
* https://developers.google.com/admin-sdk/directory/v1/reference/mobiledevices/list
*/
function getDevices() {
  try{
    var adminUser = AdminDirectory.Users.get("apps.admin@example.com");
    var customerId = adminUser.customerId;
    
    var items = new Array();
    var nextPageToken = "";

    do{
      // maxResultsはデフォルトでは100だがresponse too largeで落ちてしまうので50に減らした
      var devices = AdminDirectory.Mobiledevices.list(customerId,{maxResults: 50, pageToken: nextPageToken});
      nextPageToken = devices.nextPageToken;
      
      for(var i = 0; i < devices.mobiledevices.length; i++){
        var mobile= devices.mobiledevices[i];
        
        items.push({
          deviceId: mobile.deviceId,// 端末Id
          name: mobile.name + '', // 使用者名（配列なので文字列化）
          email: mobile.email + '', // メールアドレス（配列なので(ry）
          model: mobile.model, // 機種
          os: mobile.os, // OS
          userAgent: mobile.userAgent, // ユーザーエージェント
          type: mobile.type, // タイプ
          firstSync: Utilities.formatDate(new Date(mobile.firstSync), "JST", "yyyy/MM/dd HH:mm:ss"), // 最初の同期
          lastSync: Utilities.formatDate(new Date(mobile.lastSync), "JST", "yyyy/MM/dd HH:mm:ss"), // 最終同期
          status: mobile.status, // ステータス
          serialNumber: mobile.serialNumber // シリアルナンバー
        });
      }
      
    }while(nextPageToken);
    
    // Devicesのシートに書き込み
    writeSpreadsheet("Devices", items);
  }catch(e){
    Logger.log(e);
    ScriptApp.newTrigger("getGroups").timeBased().after(1000 * 60 * 15).create();
  }
}
