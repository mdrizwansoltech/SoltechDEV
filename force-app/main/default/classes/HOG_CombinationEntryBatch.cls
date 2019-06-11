global class HOG_CombinationEntryBatch implements Database.Batchable<sObject>{
    global  String Query;
    
    global Database.QueryLocator start(Database.BatchableContext BC){
        string DateRange=Label.LastOrderItemsDays;
        query ='select Id,CreatedById, High__c, Name,Pharmacy__c,cost_code__c,LastModifiedById, Low__c, OwnerId,Combination_Title__c, Target__c from Combination_Entry__c where CreatedDate>='+Label.LastOrderItemsDays;
        return Database.getQueryLocator(query);
    }
    global void execute(Database.BatchableContext BC, List<Combination_Entry__c> scope){
        Map<string,Combination__c> CombinationMap=new Map<string, Combination__c>();
        List<combination__c> InsertCombination=new List<combination__c>();
        List<Combination_Asset__c> InsertCombinationAsset=new List<Combination_Asset__c>();
        try{  
            List<Combination__c> ListOfCombinationRecords =[select id,Combination_Title__c,Low__c,High__c,Target__c, Cost_Code__c,Pharmacy__c,product__c from combination__c];
            if(ListOfCombinationRecords.size()>0){
            for(combination__c c:ListOfCombinationRecords){
                CombinationMap.put(c.Combination_Title__c,c);
            }
            }
             if(scope.size()>0){
            for(Combination_Entry__c ce : scope){
                if(!CombinationMap.containskey(ce.Combination_Title__c)){
                    combination__c c=new combination__c();
                    c.Low__c= ce.Low__c;
                    c.High__c=ce.High__c;
                    c.Target__c=ce.Target__c;
                    c.Cost_Code__c=ce.Cost_Code__c;
                    c.Pharmacy__c=ce.Pharmacy__c;
                    c.Combination_Title__c=ce.Combination_Title__c;
                    InsertCombination.add(c);
                }
            }  
            }
            
            
            
            // Bulk insert all Record with one DML call
            Database.SaveResult[] srList = Database.insert(InsertCombination, false);
            // Iterate through each returned result
            for (Database.SaveResult sr : srList) {
                if (sr.isSuccess()) {
                    // Operation was successful, so get the ID of the record that was processed
                    System.debug('Successfully inserted ID: ' + sr.getId());
                } else {
                    // Operation failed, so get all errors
                    for(Database.Error err : sr.getErrors()) {
                        System.debug('The following error has occurred.');
                        System.debug(err.getStatusCode() + ': ' + err.getMessage());
                        System.debug('fields that affected this error: ' + err.getFields());
                    }
                }
            }
            
            if(InsertCombination.size()>0){

            for(combination__c CRecord:InsertCombination){
                Combination_Asset__c CA=new Combination_Asset__c();
                CA.combination__c=CRecord.id;
                // Quantity__c Asset__c Combination__c 
                // Ca.Name=CRecord.CombinationTitle__c;
                InsertCombinationAsset.add(CA);   
            }
            } 
            
            
            
            // Bulk insert all Record with one DML call
            Database.SaveResult[] srList2 = Database.insert(InsertCombinationAsset, false);
            // Iterate through each returned result
            for (Database.SaveResult sr : srList2) {
                if (sr.isSuccess()) {
                    // Operation was successful, so get the ID of the record that was processed
                    System.debug('Successfully inserted ID: ' + sr.getId());
                } else {
                    // Operation failed, so get all errors
                    for(Database.Error err : sr.getErrors()) {
                        System.debug('The following error has occurred.');
                        System.debug(err.getStatusCode() + ': ' + err.getMessage());
                        System.debug('fields that affected this error: ' + err.getFields());
                    }
                }
            }
            
        Date DeleteDate=Date.valueOf(Label.HOG_OrderDeleteDate);
       
        //Date ToDate=Date.today()-180 ;
            
        List<Combination__c> DeletecombinationList=[select Id from Combination__c where CreatedDate<=:DeleteDate];
        List<Combination_asset__c> DeletecombinationAssetList=[select Id from Combination_asset__c where CreatedDate<=:DeleteDate];
         List<Combination_Entry__c> DeleteCombinationEntryList=[select Id,CreatedById, High__c, Name,Pharmacy__c,cost_code__c,LastModifiedById, Low__c, OwnerId,Combination_Title__c, Target__c from Combination_Entry__c where CreatedDate<=:DeleteDate];
      
             if(DeletecombinationAssetList.size()>0){
              Delete DeletecombinationAssetList;
             }
            
            if(DeletecombinationList.size()>0){
             Delete DeletecombinationList;
             }
            
            
            if(DeleteCombinationEntryList.size()>0){
             Delete DeleteCombinationEntryList;
             }
           
            
            
            
        }
        catch(Exception ex){
            
        }
    }
    
    global void finish(Database.BatchableContext BC){
    }
}