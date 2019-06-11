public with sharing class HOG_OrderItemController {
   
    @AuraEnabled
    public static void saveOrderprod(List<OrderItem> ordProdList,Id selectedprod ){
        system.debug('selectedprod'+selectedprod);
        ordProdList[0].Product2ID = selectedprod;
        system.debug('ordProdList'+ordProdList);
        Insert ordProdList;
        
    }
    
    @AuraEnabled
    public static list<Product2> getProducts(){
        
        return ([Select Id, Name from Product2 where Product_Type__c = 'Rx']);
    }
    
    
    @AuraEnabled
    public static list<OrderItem> getActPresPrdValues(){
        
        return ([Select Id,Previous_Quantity__c,Product2.Name,Quantity_Needed__c,Quantity_In_Stock__c,Quantity_On_Hand__c,UnitPrice  from OrderItem where Product2.Product_Type__c = 'Rx' and Prescription__r.Active__c = True]);
    }
    
    @AuraEnabled
    public static list<Product_Template__c> getProdtemps(){
        
        return ([Select Id, Name from Product_Template__c where IsActive__c= true]);
    }
     @AuraEnabled
    public static list<Product2> getsupplyCatprod(string selectedCategory){
        
        return ([Select Id, Name,Category__c from Product2 where Product_Type__c = 'Supply' AND Category__c =: selectedCategory]);
    }
    
    @AuraEnabled
    public static list<OrderItem> getselectedTemplate(Id selectedTemplate){
        system.debug('selectedTemplate:: '+selectedTemplate);
        
        list<OrderItem> orderItemrec =[Select Id,Product2.Name,Category__c,Previous_Quantity__c,Quantity_Needed__c,Quantity_In_Stock__c,UnitPrice from OrderItem 
                                       where Product2.Product_Template__r.id = :selectedTemplate and Product2.Product_Type__c = 'Supply'];
        system.debug('orderItemrec'+orderItemrec);
        return orderItemrec;
        
    } 
    
    
    
    @AuraEnabled
    public static list<Product2> getSupplyProducts(){
        
        return ([Select Id, Name from Product2 where Product_Type__c = 'Supply']);
    }
    
    @AuraEnabled
    public static List<String> getPickListValues(String obj, String str) {
        String[] options = new String[]{}; 
            Schema.DescribeFieldResult plistvalues = Schema.getGlobalDescribe().get(obj).getDescribe().fields.getMap().get(str).getDescribe();
        options.add('--None--');
        for(PicklistEntry ent:plistvalues.getpicklistvalues())
        {
            options.add(ent.getLabel());
        } 
        return options;
    }
    
    @AuraEnabled
    public static list<OrderItem> getPreOrderItem(Id OrderId){
        
        list<OrderItem> orderItemrecs = [Select Id,Product2.Name,Quantity,Prescription__r.Dosing__c,Previous_Quantity__c,Quantity_In_Stock__c,UnitPrice from OrderItem where OrderId = '8010j0000003r2D' AND Product2.Product_Type__c = 'Rx' ];
       system.debug('orderItemrecs'+orderItemrecs);
        return orderItemrecs;
        
        
    }
 
    @AuraEnabled
    public static list<OrderItem> getPresupplyItem(Id OrderId){
        system.debug('OrderId'+OrderId);
        return ([Select Id,Category__c,Product2.Name,Quantity,Previous_Quantity__c,Quantity_In_Stock__c from OrderItem where OrderId ='8010j0000003r2D' And Product2.Product_Type__c = 'Supply']);
        
    }
    @AuraEnabled
    public static list<OrderItem> copyLastorderItemRX(Id OrderId){
        
        return ([Select Id from OrderItem where OrderId =:OrderId]);
    }
    
    @AuraEnabled
    public static Order createOrderRec( order orderRecord) {
        system.debug('orderRecord'+orderRecord);
        system.debug('ord111111111'+orderRecord.Placed_by__c); 
         
          upsert orderRecord;
        
        Order ord = [SELECT Id, Instructions__c, Previous_Instructions__c, EffectiveDate, 
                           Previous_Order__c, Shipping_Address__r.Id FROM Order 
                            WHERE Id =:orderRecord.Id];
         
        return ord;
       
    }
    
    
}