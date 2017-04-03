/**
* ドメイン内の全グループ一覧を取得
*/
function getGroups() {
  try{
    var items = new Array();
    var nextPageToken = "";
    var domain = "example.com";

    do{    
      // 全グループを取得
      var list = AdminDirectory.Groups.list({domain:domain, pageToken: nextPageToken});
      var groups = list.groups;
      nextPageToken = list.nextPageToken;
      
      for(var i = 0; i < groups.length; i++){
        var group = groups[i];
        
        var groupId = group.email;
        var detailLink = "https://admin.google.com/AdminHome#GroupDetails:groupEmail=" + groupId;
        var groupServiceLink = "https://groups.google.com/a/" + domain + "/forum/#!forum/" + groupId.replace("@" + domain,"");
        
        items.push({
          GroupName: group.name,
          GroupId: groupId,
          Description: group.description,
          IsUserCreated: groupId.indexOf('-g@' + domain) != -1,
          GroupDetailsLink : detailLink,
          GroupServiceLink: groupServiceLink
        });
      }
    }while(nextPageToken);
    
    // スプレッドシートに書き込み。Spreadsheet.gs
    writeSpreadsheet("Group", items);
    
  // 内部エラーの場合15分後にトリガーを追加
  }catch(e){
    Logger.log(e);
    ScriptApp.newTrigger("getGroups").timeBased().after(1000 * 60 * 15).create();
    throw e;
  }
}
