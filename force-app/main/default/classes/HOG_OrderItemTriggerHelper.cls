Public class HOG_OrderItemTriggerHelper{
     
    Public void CreateCombinationEntryRecords(List<OrderItem> listOfOrderItems){
        
        List<Combination_Entry__c> InsertOfCombinationEntry=new List<Combination_Entry__c>(); 
        
        List<id> ListOfPrescriptionProfileIds=new List<id>();
        List<id> ListofOrderIds=new List<id>();
        List<id> ListofOrderItemIds=new List<id>();    
        for(OrderItem OrderItems:listOfOrderItems){
            // ListOfPrescriptionProfileIds.add(OrderItems.Prescription_Profile__c);
            ListofOrderIds.add(OrderItems.OrderId);
            ListofOrderItemIds.add(OrderItems.Id);
        }
        List<Order> ListOfOrders=[select id,Client_Chart__r.Pharmacy__c,Client_Chart__r.Pharmacy__r.Name,Client_Chart__r.Cost_Code__c from order where id in:ListofOrderIds];
        Map<string,Order> MapOfOrders=new Map<string,Order>();
        
        Map<string,Combination_Entry__c> CombinationMap=new Map<string,Combination_Entry__c>();
        if(ListOfOrders.size()>0){
        for(Order ord:ListOfOrders){
            MapOfOrders.put(ord.id,ord);
        }
        }
        Map<id,orderItem> orderItemsRecords=new Map<id,OrderItem>();
        List<OrderItem> ListofOrderItemRecords=[select id,Product2.Name,Product2Id,Prescription_Profile__r.Target__c,Prescription_Profile__r.high__c,Prescription_Profile__r.low__c,OrderId from OrderItem where id in:ListofOrderItemIds];
        for(orderItem o:ListofOrderItemRecords){
            orderItemsRecords.put(o.id,o);
        } 
        //List<Prescription_Profile__c> Prescriptionrecords=[select id,Target__c,high__c,low__c from Prescription_Profile__c where id in:ListOfPrescriptionProfileIds];
     
        //Querying CombinaionEntryRe cords based LastOrderItemsDays custom label
        //Date DateRange=Date.valueOf(Label.LastOrderItemsDays);
        List<Combination_Entry__c> combinationEntryReocrds=[select Id,Combination_Title__c,CombinationTitle__c,cost_code__c,CreatedById, High__c, Name, LastModifiedById, Low__c, OwnerId, Target__c from Combination_Entry__c where CreatedDate>=LAST_N_MONTHS:6];
        if(combinationEntryReocrds.size()>0){
        for(Combination_Entry__c ce:combinationEntryReocrds){
        CombinationMap.put(ce.Combination_Title__c,ce);
        }
        }
        system.debug('@@@@@@@@@@@@@@@@@@@@@@@CombinationMap'+CombinationMap);
        for(OrderItem OrderItems:listOfOrderItems){
            order orderRec=MapOfOrders.get(OrderItems.OrderId);
            OrderItem orderItemRec=orderItemsRecords.get(OrderItems.id);
            string CombinationKey=orderRec.Client_Chart__r.Pharmacy__r.Name+orderItemRec.Product2.Name+orderRec.Client_Chart__r.Cost_Code__c+orderItemRec.Prescription_Profile__r.Target__c+orderItemRec.Prescription_Profile__r.low__c+orderItemRec.Prescription_Profile__r.high__c;
            
            system.debug('@@@@@@@@@@@@@@@@@@@@@@@CombinationKey'+CombinationKey);
            if(!CombinationMap.containskey(CombinationKey)){
           
            Combination_Entry__c  combinationEntry=new Combination_Entry__c();
            combinationEntry.High__c=orderItemRec.Prescription_Profile__r.Target__c;
            combinationEntry.Low__c=orderItemRec.Prescription_Profile__r.high__c;
            combinationEntry.Target__c=orderItemRec.Prescription_Profile__r.low__c;
           
            combinationEntry.Pharmacy__c=orderRec.Client_Chart__r.Pharmacy__c;
            combinationEntry.Product__c=orderItemRec.Product2Id;
            combinationEntry.Cost_Code__c=orderRec.Client_Chart__r.Cost_Code__c;
            combinationEntry.Combination_Title__c=CombinationKey;
            InsertOfCombinationEntry.add(combinationEntry);
            }
        }
        if(InsertOfCombinationEntry.size()> 0){
          // Bulk insert all Record with one DML call
            Database.SaveResult[] srList = Database.insert(InsertOfCombinationEntry, false);
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
        }
    }
    
   // @AuraEnabled
     // @InvocableMethod 
      Public static void CreateCombination(string Pharmacy,string product,String CostCode,decimal target,decimal Low,decimal high){
        
        List<Combination__c> InsertCombination=new List<Combination__c>();
        List<Combination_Asset__c> InsertCombinationAsset=new List<Combination_Asset__c>();
        
        Map<string,Combination__c> CombinationMap=new Map<string,Combination__c>();
          
     
        string datevalues=Label.LastOrderItemsDays;
          
        List<Combination__c> combinationReocrds=[select Id,product__c,Combination_Title__c from Combination__c where CreatedDate>=LAST_N_MONTHS:6];
        if(combinationReocrds.size()>0){
        for(Combination__c ce:combinationReocrds){
        CombinationMap.put(ce.Combination_Title__c,ce);
        }
        }
          
              string CombinationKey=Pharmacy+CostCode+target+Low+high;
          
              if(!CombinationMap.containskey(CombinationKey)){
                    combination__c c=new combination__c();
                    c.Low__c= Low;
                    c.High__c=High;
                    c.Target__c=Target;
                    c.Cost_Code__c=CostCode;
                    c.Pharmacy__c=Pharmacy;
                    c.Product__c=Product;
                    c.Combination_Title__c=CombinationKey;
                    InsertCombination.add(c);
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
            
      }
}