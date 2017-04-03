/**
* ユーザー一覧を取得
* https://developers.google.com/admin-sdk/directory/v1/reference/users/list
*/
function getUsers() {
  try{
    var items = new Array();
    var nextPageToken = "";
    var domain = "example.com";
    
    do{
      var list = AdminDirectory.Users.list({domain: domain, pageToken: nextPageToken});
      
      var users = list.users;
      nextPageToken = list.nextPageToken;
      
      for(var i = 0; i < users.length; i++){
        var user = users[i];
        
        items.push({
          familyName: user.name.familyName,
          givenName: user.name.givenName,
          primaryEmail: user.primaryEmail,
          isAdmin: user.isAdmin,
          suspended: user.suspended,
          orgUnitPath: user.orgUnitPath
        });
      }
      
    }while(nextPageToken);
    
    // Userのシートに書き込み
    writeSpreadsheet("User", items);
  }catch(e){
    
    ScriptApp.newTrigger("getGroups").timeBased().after(1000 * 60 * 15).create();
  }
}
