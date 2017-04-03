function getOrgUsers(){
  try{
    var adminUser = AdminDirectory.Users.get("apps.admin@example.com");
    var customerId = adminUser.customerId;
    
    var orgUnits = AdminDirectory.Orgunits.list(customerId, 
                                                {
                                                  type: "all"
                                                }).organizationUnits;
    
    var units = new Array();  
    for(var i = 0 ; i < orgUnits.length; i++){
      var orgUnit = orgUnits[i];
      
      var parentOrgUnitName = "";
      if(orgUnit.parentOrgUnitPath){
        for(var j = 0; j < orgUnits.length; j++){
          if(orgUnits[j].orgUnitPath == orgUnit.parentOrgUnitPath){
            parentOrgUnitName = orgUnits[j].name;
            break;
          }
        }
      }
      
      units.push({
        OrgUnitName: orgUnit.name,
        OrgUnitPath: orgUnit.orgUnitPath,
        Description: orgUnit.description,
        ParentOrgUnitName : parentOrgUnitName,
        ParentOrgUnitPath: orgUnit.parentOrgUnitPath
      });
    }
    writeSpreadsheet("OrgUnit", units);
    
    // 内部エラーの場合15分後にトリガーを作成
  }catch(e){
    ScriptApp.newTrigger("getOrgUsers").timeBased().after(900000).create();
    throw e;
  }
}