public without sharing class HOG_ClientShippingInfo  {
    
@AuraEnabled
    public static List<String> getPickListValuesIntoList(){
       List<String> pickListValuesList= new List<String>();
		Schema.DescribeFieldResult fieldResult = Order.Order_Step__c.getDescribe();
		List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
		for( Schema.PicklistEntry pickListVal : ple){
			pickListValuesList.add(pickListVal.getLabel());
		}     
		return pickListValuesList;
    }
   @AuraEnabled
    public static   Order getOrderDetails(String RecordId) { 
        if(RecordId != null){
         Order ord= [Select id, account.PersonBirthdate, account.FirstName, account.LastName,Client_Chart__c,Client_Chart__r.Name,Order_Step__c from Order where Id =: RecordId];
        return ord;
        }Else{
        return null;
        
        }
    }
    
    @AuraEnabled
    public static   Order getAccountInfo(String ClientId) {
       Order ord= [Select id, account.PersonBirthdate, account.FirstName, account.LastName from Order where Client_Chart__c =:ClientId];
        return ord;
        
    }
        
       @AuraEnabled
    public static Order saveClientToOrder(String ClientId, String OrderId) {
        Order ord= new order();
        
        try {
          Client_Chart__c Chat = [select id,Account__c,account__r.FirstName, account__r.LastName,
                                  account__r.Name  from Client_Chart__c where id =:ClientId Limit 1];  
            
         list<order> orr = [SELECT Id, AccountId, ActivatedById, ActivatedDate, BillingAddress, BillingCity, BillingCountry, 
                            BillingGeocodeAccuracy, BillingLatitude, BillingLongitude, BillingState, BillingStreet, 
                            BillingPostalCode, Client_Chart__c, Client_Name__c, CompanyAuthorizedById, ContractId, 
                            CreatedById, CreatedDate, CustomerAuthorizedById, Date_of_birth__c, IsDeleted, 
                            Deliver_By_Date__c, Description, Instructions__c, LastModifiedById, LastModifiedDate, 
                            LastReferencedDate, LastViewedDate, TotalAmount, EndDate, OriginalOrderId, OrderNumber, 
                            EffectiveDate, Order_Step__c, Type, OwnerId, Pharmacy__c, Pharmacy_Deliver_By__c, 
                            Pharmacy_Instructions__c, Pharmacy_Release_Number__c, Pharmacy_RPH__c, Phone__c, //Placed_By__c, 
                            Previous_Instructions__c, Previous_Order__c, Pricebook2Id, IsReductionOrder, RPH_Consult__c, 
                            Ship_To_Name__c, Ship_Via__c, ShippingAddress, Shipping_Address__c, ShippingCity, ShippingCountry,
                            ShippingGeocodeAccuracy, ShippingLatitude, ShippingLongitude, ShippingState, ShippingStreet, 
                            ShippingPostalCode, Signature__c, Status, StatusCode, SystemModstamp, Tracking_Number__c 
                            FROM Order WHERE Client_Chart__c =:ClientId ORDER BY CreatedDate DESC ] ;
            
            
            
            ord.Client_Chart__c = ClientId;
            ord.EffectiveDate =system.today();
            ord.Status = 'New';
            ord.Previous_Instructions__c = orr.get(0).Instructions__c ;
            ord.Previous_Order__c = orr.get(0). EffectiveDate ;
           // ord.Placed_By__c = orr.get(0).Placed_By__c ;
            ord.Phone__c = orr.get(0).Phone__c ;
            ord.Ship_To_Name__c = orr.get(0).Ship_To_Name__c ;
            ord.Shipping_Address__c = orr.get(0).Shipping_Address__c;
            ord.Signature__c = orr.get(0).Signature__c ;
            ord.Order_Step__c = 'Contact Info';
            if(!string.isEmpty(Chat.Account__c)){
              ord.AccountId = Chat.Account__c;  
            }
            if(!string.isEmpty(OrderId)){
              ord.Id = OrderId;  
            }
            ord.Order_Step__c='Select Client';
          upsert ord;
        }catch(exception ex){
            system.debug('wqerewqwerr'+ ex.getMessage());
        }
        system.debug('wqerewqwerr'+ ord);
        return ord;
  }
}