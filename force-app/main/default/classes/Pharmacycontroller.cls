public class Pharmacycontroller { 
   
    @AuraEnabled
    public static Order saveClientToOrder(String ClientId, String OrderId) {
        Order ord= new order();
        
        try {
            Client_Chart__c Chat = [select id,Account__c,Pharmacy__c,account__r.FirstName, account__r.LastName,
                                    account__r.Name  from Client_Chart__c where id =:ClientId Limit 1];  
            
            list<order> orr = [SELECT Id, AccountId, ActivatedById, ActivatedDate, Address_Line__c, Address_Line_2__c,
                               Address_Type__c, BillingAddress, BillingCity, BillingCountry, BillingGeocodeAccuracy, 
                               BillingLatitude, BillingLongitude, BillingState, BillingStreet, BillingPostalCode, 
                               City1__c, Client_Chart__c, Client_Name__c, Client_Name_C__c, CompanyAuthorizedById, ContractId,
                               county__c, CreatedById, CreatedDate, CustomerAuthorizedById, Date_of_birth__c, IsDeleted, 
                               Deliver_By_Date__c, Description, Instructions__c, LastModifiedById, LastModifiedDate,
                               LastReferencedDate, LastViewedDate, TotalAmount, EndDate, OriginalOrderId, Order_Notes__c, 
                               OrderNumber, EffectiveDate, Order_Step__c, Type, OwnerId, Pharmacy__c, Pharmacy_Deliver_By__c,
                               Pharmacy_Instructions__c, Pharmacy_Release_Number__c, Pharmacy_RPH__c, Phone__c, Placed_By__c,
                               Previous_Instructions__c, Previous_Order__c, Previous_Order_ID__c, Pricebook2Id, 
                               IsReductionOrder, RPH_Consult__c, Ship_To_Name__c, Ship_Via__c, ShippingAddress, 
                               Shipping_Address__c, ShippingCity, ShippingCountry, ShippingGeocodeAccuracy, 
                               ShippingLatitude, ShippingLongitude, ShippingState, ShippingStreet, ShippingPostalCode, 
                               Signature__c, State1__c, Status, StatusCode, Street_Name__c, Street_Name1__c, 
                               SystemModstamp, Tracking_Number__c, Zip_Code1__c, 
                               Shipping_Address__r.Street_Name_2__c, Shipping_Address__r.Address_Type__c, 
                                Shipping_Address__r.City1__c, Shipping_Address__r.County__c,
                                Shipping_Address__r.State1__c, Shipping_Address__r.Name, 
                                Shipping_Address__r.Zip_Code1__c 
                               FROM Order WHERE Client_Chart__c =:ClientId ORDER BY CreatedDate DESC ] ;
          
          Pricebook2 standardBook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true];
             ord.Pricebook2Id = standardbook.id;
            
            ord.Client_Chart__c = ClientId;
            
            ord.EffectiveDate =system.today();
            ord.Status = 'Order Verify';
            
            ord.Order_Step__c = 'Contact Info';
            if(!string.isEmpty(Chat.Account__c)){
                ord.AccountId = Chat.Account__c;
                ord.Pharmacy__c = Chat.Pharmacy__c;
            }
            if(!string.isEmpty(OrderId)){
                ord.Id = OrderId;  
            }
            If(orr.size()> 0){
                ord.Previous_Instructions__c = orr.get(0).Instructions__c ;
                ord.Previous_Order_ID__c = orr.get(0).ID;
                ord.Previous_Order__c = orr.get(0). EffectiveDate ;
                ord.Placed_By__c = orr.get(0).Placed_By__c ;
                ord.Phone__c = orr.get(0).Phone__c ;
                ord.Ship_To_Name__c = orr.get(0).Ship_To_Name__c ;
                ord.Shipping_Address__c = orr.get(0).Shipping_Address__c;
                ord.Signature__c = orr.get(0).Signature__c ;
                ord.City1__c = orr.get(0).Shipping_Address__r.City1__c;
                ord.State1__c = orr.get(0).Shipping_Address__r.State1__c;
               // ord.Zip_Code1__c = orr.get(0).Shipping_Address__r.Zip_Code1__c;
                ord.Address_Line__c = orr.get(0).Shipping_Address__r.Street_Name_2__c;
            system.debug('wqerewqwerr'+ ord);
            }
             
            upsert ord;
                 
        }catch(exception ex){
            system.debug('wqerewqwerr'+ ex.getMessage());
        }
        system.debug('wqerewqwerr'+ ord);
        return ord;
    }
    
    
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
    public static   Order getAccountInfo(String ClientId) {
        Order ord= [Select id, account.PersonBirthdate, account.FirstName, account.LastName from Order where Client_Chart__c =:ClientId];
        return ord;
        
    }
    @AuraEnabled        
    public static   Order getAccountInfo1(String orderId) {     
        Order ord= [Select id, AccountId, account.PersonBirthdate, account.FirstName,       
                    account.LastName from Order where id =: orderId];       
        return ord;
        
    }
    @auraEnabled  
    public static Address__c defaultaddress(String orderId) {  
        system.debug('clientId::'+orderId);
        
        list<order> orr = [SELECT Id, AccountId, ActivatedById, ActivatedDate, Address_Line__c, Address_Line_2__c, 
                           Address_Type__c, BillingAddress, BillingCity, BillingCountry, BillingGeocodeAccuracy, 
                           BillingLatitude, BillingLongitude, BillingState, BillingStreet, BillingPostalCode,
                           City1__c, Client_Chart__c, Client_Name__c, Client_Name_C__c, CompanyAuthorizedById, ContractId,
                           county__c, CreatedById, CreatedDate, CustomerAuthorizedById, Date_of_birth__c, IsDeleted, 
                           Deliver_By_Date__c, Description, Instructions__c, LastModifiedById, LastModifiedDate, 
                           LastReferencedDate, LastViewedDate, TotalAmount, EndDate, OriginalOrderId, Order_Notes__c, 
                           OrderNumber, EffectiveDate, Order_Step__c, Type, OwnerId, Pharmacy__c, Pharmacy_Deliver_By__c,
                           Pharmacy_Instructions__c, Pharmacy_Release_Number__c, Pharmacy_RPH__c, Phone__c, Placed_By__c,
                           Previous_Instructions__c, Previous_Order__c, Previous_Order_ID__c, Pricebook2Id, IsReductionOrder,
                           RPH_Consult__c, Ship_To_Name__c, Ship_Via__c, ShippingAddress, Shipping_Address__c, ShippingCity,
                           ShippingCountry, ShippingGeocodeAccuracy, ShippingLatitude, ShippingLongitude, ShippingState, 
                           ShippingStreet, ShippingPostalCode, Signature__c, State1__c, Status, StatusCode, 
                           Street_Name__c, Street_Name1__c, SystemModstamp, Tracking_Number__c, Zip_Code1__c ,Shipping_Address__r.Id
                           FROM Order WHERE Id =:orderId] ;
        
        Id addids = orr.get(0).Shipping_Address__r.Id;
        
        string addstring = String.valueOf(orr.get(0).Shipping_Address__r.Id);
        return getaddress(addstring);
        
        
    }
    @auraEnabled  
    public static Address__c getaddress(string addressId) {  
        
        // id addid = addressId;
        return [ SELECT  Id, Street_Name_2__c, City1__c, County__c, State1__c,
                Zip_Code1__c ,Address_Type__c,Address_Purpose__c, Name 
                FROM Address__c where Id =: addressId limit 1 ];   //WHERE Id =: clientId
        
    }
    
    
    @auraEnabled  
    public static Pharmacy_Order__c getPharmacyOrder(String clientId) {  
        system.debug('clientId:::'+clientId);
        return [ SELECT Id,Account__r.id, Name,LastModifiedDate,Deliver_By_Date__c,Instructions__c,
                Previous_Date__c,Order_Previous_Instructions__c FROM Pharmacy_Order__c WHERE Id =: clientId Order BY LastModifiedDate Desc];   
        
    }
    
    public class untitleSObject {
        @AuraEnabled
        public String currentworkingTitleId {get; set;}
        @AuraEnabled
        public String currentworkingTitleName {get; set;}
    }
    
    @AuraEnabled
    public static Order createOrderRec( order orderRecord) {
        system.debug('orderRecord'+orderRecord);
        
        system.debug('ord111111111'+orderRecord.Id);
         order orr = [SELECT Id, AccountId, ActivatedById, ActivatedDate, Address_Line__c, Address_Line_2__c,
                               Address_Type__c, BillingAddress, BillingCity, BillingCountry, BillingGeocodeAccuracy, 
                               BillingLatitude, BillingLongitude, BillingState, BillingStreet, BillingPostalCode,
                               City1__c, Client_Chart__c, Client_Name__c, Client_Name_C__c, CompanyAuthorizedById, ContractId,
                               county__c, CustomerAuthorizedById, Date_of_birth__c, IsDeleted, 
                               Deliver_By_Date__c, Description, Instructions__c, LastModifiedById, LastModifiedDate,
                               LastReferencedDate, LastViewedDate, TotalAmount, EndDate, OriginalOrderId, Order_Notes__c, 
                               OrderNumber, EffectiveDate, Order_Step__c, Type, OwnerId, Pharmacy__c, Pharmacy_Deliver_By__c,
                               Pharmacy_Instructions__c, Pharmacy_Release_Number__c, Pharmacy_RPH__c, Phone__c, Placed_By__c,
                               Previous_Instructions__c, Previous_Order__c, Previous_Order_ID__c, Pricebook2Id, 
                               IsReductionOrder, RPH_Consult__c, Ship_To_Name__c, Ship_Via__c, ShippingAddress, 
                               Shipping_Address__c, ShippingCity, ShippingCountry, ShippingGeocodeAccuracy, 
                               ShippingLatitude, ShippingLongitude, ShippingState, ShippingStreet, ShippingPostalCode, 
                               Signature__c,  State1__c, Status, StatusCode, Street_Name1__c, 
                               SystemModstamp, Tracking_Number__c, Zip_Code1__c, 
                               Shipping_Address__r.Street_Name_2__c, Shipping_Address__r.Address_Type__c, 
                                Shipping_Address__r.City1__c, Shipping_Address__r.County__c,
                                Shipping_Address__r.State1__c, Shipping_Address__r.Name, 
                                Shipping_Address__r.Zip_Code1__c 
                               FROM Order WHERE Id =:orderRecord.Id ] ;
        
        orderRecord.City1__c = orr.Shipping_Address__r.City1__c;
        orderRecord.State1__c = orr.Shipping_Address__r.State1__c;
        //orderRecord.Zip_Code1__c = orr.Shipping_Address__r.Zip_Code1__c;
        orderRecord.Address_Line__c = orr.Shipping_Address__r.Street_Name_2__c ;
        orderRecord.Street_Name1__c =orr.Shipping_Address__r.Name;
        
        upsert orderRecord;
        
        return [SELECT Id, Instructions__c, Previous_Instructions__c, EffectiveDate, 
                Previous_Order__c,Previous_Order_ID__c,Order_Step__c, Shipping_Address__r.Id FROM Order 
                WHERE Id =:orderRecord.Id ];
        
    }
    
     @AuraEnabled
    public static Order   SaveOrderDetails(Order OrderRecord,String OrderId) {
        Order orderRec=new Order();
        system.debug('@@@@@@@@@@@@@@@OrderRecord'+OrderRecord);
         system.debug('@@@@@@@@OrderId'+OrderId);
        orderRec.Id=OrderId;
      orderRec.Pharmacy__c= OrderRecord.Pharmacy__c;
      orderRec.Client_Name__c=OrderRecord.Client_Name__c;
     // orderRec.Medical_Disorder__c=OrderRecord.Medical_Disorder__c;
     // orderRec.Dosage_Range_From__c=OrderRecord.Dosage_Range_From__c; 
     // orderRec.Dosage_To__c=OrderRecord.Dosage_To__c;
      orderRec.EffectiveDate=OrderRecord.EffectiveDate;
      orderRec.Deliver_By_Date__c=OrderRecord.Deliver_By_Date__c;  
      orderRec.Placed_By__c= OrderRecord.Placed_By__c;
      orderRec.RPH_Consult__c= OrderRecord.RPH_Consult__c;
      orderRec.Ship_To_Name__c=OrderRecord.Ship_To_Name__c;
      orderRec.Street_Name1__c=OrderRecord.Street_Name1__c; 
       orderRec.Address_Line__c=OrderRecord.Address_Line__c; 
       orderRec.City1__c= OrderRecord.City1__c;
       orderRec.State1__c= OrderRecord.State1__c;
      orderRec.Zip_Code1__c= OrderRecord.Zip_Code1__c;
       orderRec.Ship_Via__c= OrderRecord.Ship_Via__c;
        orderRec.Signature__c= OrderRecord.Signature__c;
        orderRec.Order_Notes__c= OrderRecord.Order_Notes__c;
        orderRec.Phone__c=OrderRecord.Phone__c;
      //  orderRec.Level__c= OrderRecord.Level__c;
         orderRec.status= OrderRecord.status;
        
        update orderRec;
        return orderRec;
    }
    
    @AuraEnabled
    public static   List<Insurance_Coverage__c> getInsuranceInfo(String OrderId) {
        //system.debug('$$$$$$$$$$ '+ClientId);
        List<Insurance_Coverage__c> ListOfInsurance = new List<Insurance_Coverage__c>();
        try{
            order  OrderClient=[select id,Client_Chart__c from order where id=:OrderId];
            ListOfInsurance = [Select id, Policy_Number__c,Coverage_Order__c,Category__c,
                               Insurance_Provider__c,Effective_Date__c, InForce__c, Plan_Type__c, Termination_Date__c,
                               Insurance_Provider_Name__c,Plan_Name__c,Insured_Client__r.Name 
                               from Insurance_Coverage__c 
                               where Insured_Client__c =: OrderClient.Client_Chart__c AND InForce__c = true];
            
        }catch(exception e){
            
        }
        //system.debug('########## '+ListOfInsurance);
        return ListOfInsurance;
        
    }
    
    @AuraEnabled
    public static   Order getOrderDetails(String RecordId) { 
        if(RecordId != null){
            
            Order ord= [SELECT Id, AccountId, ActivatedById, ActivatedDate, Address_Line__c, Address_Line_2__c, 
                        Address_Type__c, BillingAddress, BillingCity, BillingCountry, BillingGeocodeAccuracy,
                        BillingLatitude, BillingLongitude, BillingState, BillingStreet, BillingPostalCode, 
                        City1__c, Client_Chart__c, Client_Name__c, Client_Name_C__c, CompanyAuthorizedById, ContractId, 
                        county__c, CreatedById, CreatedDate, CustomerAuthorizedById, Date_of_birth__c, IsDeleted, 
                        Deliver_By_Date__c, Description, Instructions__c, LastModifiedById, LastModifiedDate, 
                        LastReferencedDate, LastViewedDate, TotalAmount, EndDate, OriginalOrderId, Order_Notes__c, 
                        OrderNumber, EffectiveDate, Order_Step__c, Type, OwnerId, Pharmacy__c,Pharmacy__r.name,Pharmacy_Deliver_By__c, 
                        Pharmacy_Instructions__c,Name,Client_Chart__r.Name,Pharmacy_Release_Number__c, Pharmacy_RPH__c, Phone__c, Placed_By__c, 
                        Previous_Instructions__c, Previous_Order__c, Previous_Order_ID__c, Pricebook2Id, IsReductionOrder, 
                        RPH_Consult__c, Ship_To_Name__c, Ship_Via__c, ShippingAddress, Shipping_Address__c, ShippingCity,
                        ShippingCountry, ShippingGeocodeAccuracy, ShippingLatitude, ShippingLongitude, ShippingState, 
                        ShippingStreet, ShippingPostalCode, Signature__c, State1__c, Status, StatusCode, 
                         Street_Name1__c, SystemModstamp, Tracking_Number__c, Zip_Code1__c 
                        FROM Order where Id =: RecordId];
            system.debug('##########getOrderDetails '+ord);
            return ord;
        }Else{
            return null;
            
        }
    }
  @AuraEnabled
    public static void UpdateOrderItem(List<ProductWrapper> OrderWrapProdList){
    List<ProductWrapper> prolist=new List<ProductWrapper>();
        List<orderItem> ordItems=new List<orderItem>();
        for(ProductWrapper p:OrderWrapProdList){
            ordItems.add(p.OrderProduct);
        }
        
        upsert ordItems;
          }
    @AuraEnabled
    public static list<OrderItem> saveOrderprod(string orderid, List<Id> prBookID,list<Orderitem> RXOrderItemList,list<Orderitem> SupplyOrderItemList){
        //system.debug('orderid'+orderid);
        system.debug('prBookID'+prBookID);
        //system.debug('RXOrderItemList'+RXOrderItemList);
        //system.debug('SupplyOrderItemList'+SupplyOrderItemList);
        //
        list<Orderitem> masteritems = new list<Orderitem>(); 
        masteritems.addall(RXOrderItemList);
        masteritems.addall(SupplyOrderItemList);
        system.debug('masteritems'+masteritems);
        
        Pricebook2 standardBook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true];
        list<Orderitem> lineitems = new list<Orderitem>(); 
        list<Orderitem> lineitems1 = new list<Orderitem>();
        set<Orderitem> lineitemsset = new set<Orderitem>();
        
        list<PricebookEntry> ple= [select Id,Pricebook2Id,UnitPrice,Product2Id,ProductCode, 
                                   Product2.Product_Type__c,Category__c from PricebookEntry
                                   where ID IN :prBookID  
                                   AND IsActive = true
                                   AND Product2.IsActive = true];
        
        list<Prior_Authorization__c> pa =[SELECT Id, Beginning_Date__c, Client__c, CreatedById, CreatedDate, IsDeleted, 
                                          Ending_Date__c, Name,Insurance_Coverage__c, LastActivityDate, LastModifiedById, 
                                          LastModifiedDate, LastReferencedDate,LastViewedDate, Maximum_Claims_Per_Month__c, 
                                          Maximum_Claims_Per_PA__c, Minimum_Days_Between_Claims__c,OwnerId, PA_Number__c, 
                                          Prior_Autorization11__c, Product__c, Product__r.ProductCode FROM Prior_Authorization__c 
                                          ];
        
        system.debug('ple***************'+ple);
       
        Map<string,PricebookEntry> MapOfPricebookEntryRecords=new Map<string,PricebookEntry>();
        Map<string,Prior_Authorization__c> MapOfPriorAuthorizationRecords=new Map<string,Prior_Authorization__c>();
        Map<string,Orderitem> MapOfOrderItemsRecords=new Map<string,Orderitem>();
        List<Orderitem> OrderItemListforInsert=new List<OrderItem>();
        for(PricebookEntry pe:ple){
            MapOfPricebookEntryRecords.put(pe.ProductCode,pe);
        }
        for(Prior_Authorization__c pa1:pa){
            MapOfPriorAuthorizationRecords.put(pa1.Product__r.ProductCode,pa1);
        }
          
        for(Orderitem oi :masteritems ){ 
            PricebookEntry PriceBE=MapOfPricebookEntryRecords.get(oi.ProductCode__c);
            Prior_Authorization__c Priorau = MapOfPriorAuthorizationRecords.get(oi.ProductCode__c);
             Orderitem oitem = new Orderitem();
             oitem.OrderId = orderid;                      
             oitem.PricebookEntryId = PriceBE.Id;          
             oitem.UnitPrice = PriceBE.UnitPrice;            
             oitem.Quantity = 1; 
             oitem.ProductCode__c=PriceBE.ProductCode;
             oitem.Quantity_In_Stock__c = oi.Quantity_In_Stock__c;
             oitem.Quantity_On_Hand__c = oi.Quantity_On_Hand__c;
             oitem.Quantity_Needed__c = oi.Quantity_Needed__c;
             oitem.Product_Family__c = oi.Product_Family__c;
            if(priorau != null){
             oitem.Dosing__c = oi.Dosing__c;
            }    
                if(priorau != null){
                 oitem.Prior_Authorization__c = priorau.Id;
                }
             oitem.Category__c = oi.Category__c;
             if(oi.Id != null){
             oitem.Id = oi.Id;
             }
            
            if(oi.RX_Number__c!=null){
                oitem.RX_Number__c=oi.RX_Number__c;
            }
                
             OrderItemListforInsert.add(oitem);
         }
        
        system.debug('OrderItemListforInsert'+OrderItemListforInsert);
       
        upsert OrderItemListforInsert;
        
        system.debug('OrderItemListforInsert'+OrderItemListforInsert);
       
       
        return OrderItemListforInsert; 
        
    }
    @AuraEnabled
    public static list<OrderItem> saveOrderprodfromorderitem(string orderid, List<Id> prBookID,list<Orderitem> RXOrderItemList,list<Orderitem> SupplyOrderItemList){
        //system.debug('orderid'+orderid);
        system.debug('prBookID'+prBookID);
        //system.debug('RXOrderItemList'+RXOrderItemList);
        //system.debug('SupplyOrderItemList'+SupplyOrderItemList);
        //
        list<Orderitem> masteritems = new list<Orderitem>(); 
        masteritems.addall(RXOrderItemList);
        masteritems.addall(SupplyOrderItemList);
        system.debug('masteritems'+masteritems);
        
        Pricebook2 standardBook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true];
        list<Orderitem> lineitems = new list<Orderitem>(); 
        list<Orderitem> lineitems1 = new list<Orderitem>();
        set<Orderitem> lineitemsset = new set<Orderitem>();
        
        list<PricebookEntry> ple= [select Id,Pricebook2Id,UnitPrice,Product2Id,ProductCode, 
                                   Product2.Product_Type__c,Category__c from PricebookEntry
                                   where  IsActive = true
                                   AND Product2.IsActive = true];
        
        list<Prior_Authorization__c> pa =[SELECT Id, Beginning_Date__c, Client__c, CreatedById, CreatedDate, IsDeleted, 
                                          Ending_Date__c, Name,Insurance_Coverage__c, LastActivityDate, LastModifiedById, 
                                          LastModifiedDate, LastReferencedDate,LastViewedDate, Maximum_Claims_Per_Month__c, 
                                          Maximum_Claims_Per_PA__c, Minimum_Days_Between_Claims__c,OwnerId, PA_Number__c, 
                                          Prior_Autorization11__c, Product__c, Product__r.ProductCode FROM Prior_Authorization__c 
                                          ];
        
        //system.debug('ple***************'+ple);
       
        Map<string,PricebookEntry> MapOfPricebookEntryRecords=new Map<string,PricebookEntry>();
        Map<string,Prior_Authorization__c> MapOfPriorAuthorizationRecords=new Map<string,Prior_Authorization__c>();
        Map<string,Orderitem> MapOfOrderItemsRecords=new Map<string,Orderitem>();
        List<Orderitem> OrderItemListforInsert=new List<OrderItem>();
        for(PricebookEntry pe:ple){
            MapOfPricebookEntryRecords.put(pe.ProductCode,pe);
        }
        for(Prior_Authorization__c pa1:pa){
            MapOfPriorAuthorizationRecords.put(pa1.Product__r.ProductCode,pa1);
        }
          
        for(Orderitem oi :masteritems ){ 
            PricebookEntry PriceBE=MapOfPricebookEntryRecords.get(oi.ProductCode__c);
            Prior_Authorization__c Priorau = MapOfPriorAuthorizationRecords.get(oi.ProductCode__c); 
             Orderitem oitem = new Orderitem();
             oitem.OrderId = orderid;     
            
            if(oi.ProductCode__c == null || (PriceBE.Product2.Product_Type__c == 'Factor' ||  PriceBE.Product2.Product_Type__c=='Rx')){
             oitem.PricebookEntryId=MapOfPricebookEntryRecords.get('Select product').Id;
            system.debug('PriceBE.Id***************'+PriceBE.Id);
            
            }else{
              oitem.PricebookEntryId = PriceBE.Id;
              
            }
            
                       
             oitem.UnitPrice = PriceBE.UnitPrice;            
             oitem.Quantity = 1; 
             oitem.ProductCode__c=PriceBE.ProductCode;
             oitem.Quantity_In_Stock__c = oi.Quantity_In_Stock__c;
             oitem.Quantity_On_Hand__c = oi.Quantity_On_Hand__c;
             oitem.Quantity_Needed__c = oi.Quantity_Needed__c;
             oitem.Product_Family__c = oi.Product_Family__c;
             oitem.Product_Group__c = oi.Product_Group__c;
            if(priorau != null){
             oitem.Dosing__c = oi.Dosing__c;
            }    
                if(priorau != null){
                 oitem.Prior_Authorization__c = priorau.Id;
                }
             oitem.Category__c = oi.Category__c;
             if(oi.Id != null){
             oitem.Id = oi.Id;
             }
             OrderItemListforInsert.add(oitem);
         }
        
        system.debug('OrderItemListforInsert'+OrderItemListforInsert);
       
        upsert OrderItemListforInsert;
        
        system.debug('OrderItemListforInsert'+OrderItemListforInsert);
       
       
        return OrderItemListforInsert; 
        
    }
    @AuraEnabled
    public static list<Product2> getProducts(){
        
        list<Product2> prd =[Select Id, Name from Product2 where (Product_Type__c = 'Rx' OR Product_Type__c = 'Factor')]; 
        
        return prd;
    }
        
    @AuraEnabled
    public static list<Prescription__c> getActPresPrdValues(String ClientId,Id RxPreordID){
        system.debug('ClientId'+ClientId);
        system.debug('getActPresPrdValues'+ClientId);
        list<sObject> listOrdrec = new list<sObject>();
        list<string> listOrdr = new list<string>();
        list<Prior_Authorization__c> prd =  new list<Prior_Authorization__c>();
        list<string> listRec =  new list<string>();
        list<Prescription__c> activeProds= [Select Id,Product__r.Name,Product__r.Family,Quantity_Needed__c,ProductCode__c,Dosing__c,
                                            Product_Family__c,Product_Group__c
                                       from Prescription__c  where Active__c = True AND 
                                       Client_Chart__r.id =: ClientId ];
        if(activeProds != null){
        for(Prescription__c prs:activeProds){
            
              listRec.add(prs.Product__r.Name );
        }
        }
        list<OrderItem> orderItemrecs = [Select Id,ProductCode__c,Prior_Authorization1__c,Product2.IsActive ,
                                         Product2.Name,Quantity,Order.Previous_Order_ID__c ,Prescription__r.Dosing__c,
                                         Previous_Quantity__c,OrderId,Quantity_Needed__c,Quantity_In_Stock__c,Dosing__c,
                                         Quantity_On_Hand__c,UnitPrice,Product_Group__c
                                         from OrderItem 
                                         where OrderId =: RxPreordID 
                                         AND ( Product2.Product_Type__c = 'Rx' OR  Product2.Product_Type__c = 'Factor')
                                         AND Product2.IsActive = true];
        Map<string,OrderItem> MapOfpreviousOrderItemRecords=new Map<string,OrderItem>();
        for(OrderItem pe:orderItemrecs){
            MapOfpreviousOrderItemRecords.put(pe.ProductCode__c,pe);
        }
        system.debug('listRec'+listRec);
       prd = [Select Prior_Autorization11__c,Product__r.ID,Product__r.Name from Prior_Authorization__c where 
                                        Product__r.Name =:listRec AND Insurance_Coverage__r.Coverage_Order__c = 'Primary'
                                              AND Client__r.Id =: ClientId ];
        system.debug('prd'+prd);
        
         for(Prescription__c pr : activeProds){
           OrderItem OIP=MapOfpreviousOrderItemRecords.get(pr.ProductCode__c);
            for(Prior_Authorization__c pa : prd ){
            if(pa.Product__r.Name == pr.ProductCode__c){
                pr.Prior_Autorization11__c  = pa.Prior_Autorization11__c;
                If(OIP != null){
                    pr.Previous_Quantity__c = OIP.Quantity;
                }
                 
            }}
             listOrdrec.add(pr);
         }
        
       
        if(prd != null){
         
            system.debug('listOrdrec'+listOrdrec);
            return listOrdrec;
        }
        system.debug('activeProds'+activeProds);
        return activeProds;
        
}
    @AuraEnabled
    public static list<OrderItem> getPreOrderItem(Id RxPreordID){
        system.debug('RxPreordID'+RxPreordID);
        list<OrderItem> orderItemrecs = [Select Id,ProductCode__c,Prior_Authorization1__c,Product2.IsActive ,
                                         Product2.Name,Quantity,Order.Previous_Order_ID__c ,Prescription__r.Dosing__c,
                                         Previous_Quantity__c,OrderId,Quantity_Needed__c,Quantity_In_Stock__c,Dosing__c,
                                         Quantity_On_Hand__c,UnitPrice
                                         from OrderItem 
                                         where OrderId =: RxPreordID 
                                         AND ( Product2.Product_Type__c = 'Rx' OR  Product2.Product_Type__c = 'Factor')
                                         AND Product2.IsActive = true];
        system.debug('orderItemrecs'+orderItemrecs);
        return orderItemrecs;
        
        
    }
        
   @AuraEnabled
    public static list<Prior_Authorization__c> getPriorAuth(String selProduct, string ClientId) {
        system.debug('selProduct'+selProduct);
        system.debug('ClientId'+ClientId);
      
     list<Prior_Authorization__c> prd= [Select Name,Ending_Date__c,Product__r.ID from Prior_Authorization__c where 
                                        Product__r.Name =: selProduct AND Insurance_Coverage__r.Coverage_Order__c = 'Primary'
                                       AND Client__c =: ClientId ];
        return prd;
        
    }

    
    @AuraEnabled
    public static list<Product_Template__c> getProdtemps(){
        
        return ([Select Id,IsActive__c, Name from Product_Template__c where IsActive__c = true]);
    }
    @AuraEnabled
    public static list<OrderItem> getselectedTemplate(Id selectedTemplate){
        system.debug('selectedTemplate:: '+selectedTemplate);
        
        list<OrderItem> orderItemrec =[Select Id,Product2.Name,Category__c,Previous_Quantity__c,Quantity_Needed__c,
                                       Quantity_In_Stock__c,UnitPrice,OrderId,ProductCode__c,Prior_Authorization1__c
                                       from OrderItem where Product2.Product_Template__r.id = :selectedTemplate];
        system.debug('orderItemrec'+orderItemrec);
        return orderItemrec;
        
    } 
    
    
    
   @AuraEnabled
    public static list<string> getsupplyProdOptions(){
        list<string> newlist = new list<string>();
        list<Product2> prodsllist = [Select Id, Name,Category__c,Product_Group__c from Product2 
                                     where Product_Type__c = 'Supply'
                                     AND IsActive = true];
        for (Product2 prd :prodsllist ){
            newlist.add(prd.Name);
        }
        system.debug('*********'+newlist);
        return newlist ; 
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
    public static list<OrderItem> getPresupplyItem(Id supplyPreordID){
        system.debug('supplyPreordID'+supplyPreordID);
        return ([Select Id,Product2.Name,Quantity,Product2.IsActive, Order.Previous_Order_ID__c ,Prescription__r.Dosing__c,
                 Previous_Quantity__c,OrderId,Quantity_Needed__c,Quantity_In_Stock__c,Quantity_On_Hand__c,UnitPrice,
                 ProductCode__c,Prior_Authorization1__c,Category__c
                 from OrderItem 
                 where OrderId =: supplyPreordID 
                 And Product2.Product_Type__c = 'Supply'
                AND Product2.IsActive = true]);
        
    }
    @AuraEnabled
    public static list<OrderItem> copyLastorderItem(Id OrderId){
        
        return ([Select Id,OrderId,ProductCode__c,Order.Previous_Order_ID__c,Prior_Authorization1__c from OrderItem where OrderId =:OrderId]);
    }
    
    
    @AuraEnabled        
    public static list<PricebookEntry> priceBookEntryObj(list<string> rxProductID,string orderid){      
        
        list<string> allprods = new list<string>();     
        allprods.addAll(rxProductID);       
        
        system.debug('allprods'+allprods);      
        Pricebook2 standardBook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true];      
        
        system.debug('standardBook'+standardBook);      
        list<PricebookEntry> ple= [select Id from PricebookEntry        
                                   where Pricebook2Id=:standardBook.Id AND ProductCode IN : allprods AND IsActive = true];      
        system.debug('ple'+ple);        
        return ple;     
    }
    @AuraEnabled
    public static List < String > getselectOptions(sObject objObject, string fld) {
        system.debug('objObject --->' + objObject);
        system.debug('fld --->' + fld);
        List < String > allOpts = new list < String > ();
        // Get the object type of the SObject.
        Schema.sObjectType objType = objObject.getSObjectType();
        
        // Describe the SObject using its object type.
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        
        // Get a map of fields for the SObject
        map < String, Schema.SObjectField > fieldMap = objDescribe.fields.getMap();
        
        // Get the list of picklist values for this field.
        list < Schema.PicklistEntry > values =
            fieldMap.get(fld).getDescribe().getPickListValues();
        
        // Add these values to the selectoption list.
        for (Schema.PicklistEntry a: values) {
            allOpts.add(a.getValue());
        }
        system.debug('allOpts ---->' + allOpts);
        allOpts.sort();
        return allOpts;
    }
    @AuraEnabled        
    public static list<string> getRXProdOptions(){      
        list<string> newlist = new list<string>();      
        list<Product2> prodsllist = [Select Id, Name,Category__c,IsActive from Product2 
                                     where IsActive = true AND (Product_Type__c = 'Rx' OR Product_Type__c = 'Factor')  ORDER BY Name ASC NULLS LAST ];       
        for (Product2 prd :prodsllist ){        
            newlist.add(prd.Name);      
        }       
             
        return newlist ;        
    }
     @AuraEnabled        
    public static list<Insurance_Coverage__c> getInsuranceOptions(String orderId){   
        // 'a050j000001T7Aj'
          
      list<Insurance_Coverage__c> InsuranceList= new list<Insurance_Coverage__c>(); 
        
         Order orderRec;
        if(!string.isBlank(orderId)){
        orderRec =[select id,Client_Chart__c from order where id=:orderId limit 1];
        }
        InsuranceList= [Select Id, Name,Plan_Name__c  from Insurance_Coverage__c where Insured_Client__c =:orderRec.Client_Chart__c AND InForce__c = true];  
        
        
        return InsuranceList ;        
    }


  @AuraEnabled        
    public static list<Prior_Authorization__c> getPANumberOptions(String InsuranceId){   
           
        list<Prior_Authorization__c> PAList=new  list<Prior_Authorization__c>() ;
        
       
        if(!string.isBlank(InsuranceId)){
        PAList =[select id,Insurance_Coverage__c,PA_Number__c from Prior_Authorization__c where Insurance_Coverage__c=:InsuranceId];
        }
       
        return PAList ;        
    }   
    @AuraEnabled        
    public static list<Prescription__c> getRXNumberOptions(string RecordId,String ProductCode){   
           
        list<Prescription__c> RXList=new  list<Prescription__c>() ;
          Order orderRec;
        if(!string.isBlank(RecordId)){ 
        orderRec =[select id,Client_Chart__c from order where id=:RecordId limit 1];
              system.debug('@@@@@@@@@@@@@@@@@@@@@@@@orderRec'+orderRec);
        }
       
        if(!string.isBlank(orderRec.Client_Chart__c) && !string.isBlank(ProductCode)){
        RXList =[select id,RX_Number__c,ProductCode__c,Product__c,Pharmacy__c,Client_Chart__c from Prescription__c where ProductCode__c=:ProductCode AND Client_Chart__c=:orderRec.Client_Chart__c ];
        }
       system.debug('@@@@@@@@@@@@@@@@@@@@@@@@RXList'+RXList);
        return RXList ;        
    } 
    @AuraEnabled        
    public static list<Asset> getselectedTemplate1(Id selectedTemplate){
        system.debug('selectedTemplate:: '+selectedTemplate);
        list<OrderItem> orderItemupdate = new list<OrderItem>();
        list<Asset> Product2temp =[ SELECT Id, AccountId, Name, Available_Quantity__c, IsCompetitorProduct, ContactId, 
                                    ParentId, Price, Product2Id, PurchaseDate, Purchase_Price__c, Quantity, 
                                   Quantity_In_Stock__c, Reserved_Quantity__c, RootAssetId, SerialNumber,Product2.Product_Template__c, 
                                   Status, SystemModstamp, UsageEndDate, Product2.Category__c, 
                                   Product2.ProductCode,Product2.IsActive,Product2.Product_Group__c
                                   FROM Asset 
                                   WHERE Product2.Product_Template__c =:selectedTemplate
                                   AND Product2.IsActive = true];
        
        
        system.debug('Product2temp'+Product2temp);
        return Product2temp;
        
    }
   @AuraEnabled        
    public static list<string> getSupplyProducts(string Category){ 
       
        list<string> newlist = new list<string>();      
        list<Product2> prodsllist = [Select Id, Name,ProductCode,Category__c,IsActive  
                                     from Product2 
                                     where Product_Type__c = 'Supply' AND Product_Group__c =: Category
                                     AND IsActive = true ORDER BY Name ASC NULLS LAST];      
        for (Product2 prd :prodsllist ){        
            newlist.add(prd.ProductCode);      
        }       
        system.debug('*********'+newlist);      
        return newlist ;        
    } 
     
    @AuraEnabled        
    public static list<string> getFactorRXProducts(string Productfamily){ 
       
        list<string> newlist = new list<string>(); 
        set<string> newlist1 = new set<string>();
        list<Product2> prodsllist = [Select Id, Name,ProductCode,Category__c,IsActive,Product_Group__c  
                                     from Product2 
                                     where (Product_Type__c = 'Factor') 
                                     AND IsActive = true ORDER BY Name ASC NULLS LAST]; 
        list<Product2> prodsllist1 = [Select Id, Name,ProductCode,Category__c,IsActive,Product_Group__c  
                                     from Product2 
                                     where (Product_Type__c = 'Rx') 
                                     AND IsActive = true ORDER BY Name ASC NULLS LAST]; 
        
        for (Product2 prd :prodsllist ){        
            newlist1.add(prd.Product_Group__c);      
        }
         for (Product2 prd :prodsllist1 ){        
            newlist1.add(prd.Product_Group__c);      
        }
        newlist.addAll(newlist1);
        system.debug('*********'+newlist);      
        return newlist ;        
    }
    
    @AuraEnabled        
    public static list<string> getSupplyProductgroup(string Productfamily){ 
       
        list<string> newlist = new list<string>(); 
        set<string> newlist1 = new set<string>();
        list<Product2> prodsllist = [Select Id, Name,ProductCode,Category__c,IsActive,Product_Group__c  
                                     from Product2 
                                     where (Product_Type__c = 'Supply') 
                                     AND IsActive = true ORDER BY Name ASC NULLS LAST]; 
               
        for (Product2 prd :prodsllist ){        
            newlist1.add(prd.Product_Group__c);      
        }
         
        newlist.addAll(newlist1);
        system.debug('*********'+newlist);      
        return newlist ;        
    } 
    @AuraEnabled        
    public static list<string> getSupplyProducts1(string Category){ 
       
        list<string> newlist = new list<string>();      
        list<Product2> prodsllist = [Select Id, Name,ProductCode,Category__c,IsActive
                                     from Product2 where Product_Type__c = 'Supply' AND IsActive = true];      
        for (Product2 prd :prodsllist ){        
            newlist.add(prd.ProductCode);      
        }       
        system.debug('*********'+newlist);      
        return newlist ;        
    } 
    @AuraEnabled        
    public static list<string> getRXProducts(string Productfamily){ 
       
        list<string> newlist = new list<string>();      
        list<Product2> prodsllist = [Select Id, Name,ProductCode,Category__c,IsActive  
                                     from Product2 
                                     where (Product_Type__c = 'Rx' OR Product_Type__c = 'Factor') AND Family =: Productfamily
                                     AND IsActive = true ORDER BY Name ASC NULLS LAST];      
        for (Product2 prd :prodsllist ){        
            newlist.add(prd.ProductCode);      
        }       
        system.debug('*********'+newlist);      
        return newlist ;        
    }
    @AuraEnabled
    public static list<OrderItem> getexistingproducts(Id OrderId){
        system.debug('orderItemrec'+OrderId);
        list<OrderItem> orderItemrecs = [SELECT Id, AvailableQuantity, Category__c, EndDate,  OrderId, 
                                         OrderItemNumber, OriginalOrderItemId, Prescription__c, Prescription_Profile__c, 
                                         Previous_Quantity__c, PricebookEntryId, Prior_Authorization__c, Product_Type__c, 
                                         ProductCode__c, Quantity, Quantity_In_Stock__c, Quantity_Needed__c,Prior_Authorization1__c,
                                         Quantity_On_Hand__c, ServiceDate, SystemModstamp, TotalPrice, UnitPrice,
                                         Product_Family__c,Product_Group__c  
                                         FROM OrderItem where OrderId =: OrderId  ];
        
        system.debug('orderItemrec'+orderItemrecs);
        return orderItemrecs;
        
        
    }
    
        @AuraEnabled
    public static list<ProductWrapper> getOrderproducts(Id OrderId){
        system.debug('orderItemrec'+OrderId);
        List<ProductWrapper> prodWrapperList=new List<ProductWrapper>();
        list<OrderItem> orderItemrecs = [SELECT Id, AvailableQuantity, Category__c, EndDate,  OrderId, 
                                         OrderItemNumber, OriginalOrderItemId, Prescription__c, Prescription_Profile__c, 
                                         Previous_Quantity__c, PricebookEntryId, Prior_Authorization__c, Product_Type__c, 
                                         ProductCode__c, Quantity, Quantity_In_Stock__c, Quantity_Needed__c,Prior_Authorization1__c,
                                         Quantity_On_Hand__c,Product_Group__c, ServiceDate, SystemModstamp, TotalPrice, UnitPrice,RX_Number__c 
                                         FROM OrderItem where OrderId =: OrderId  ];
       list<Prescription__c> RXList=new  list<Prescription__c>() ;
          Order orderRec;
        if(!string.isBlank(OrderId)){
        orderRec =[select id,Client_Chart__c from order where id=:OrderId limit 1];
        }
       
        if(!string.isBlank(orderRec.Client_Chart__c)){
        RXList =[select id,RX_Number__c,ProductCode__c,Product__c,Pharmacy__c,Client_Chart__c from Prescription__c where  Client_Chart__c=:orderRec.Client_Chart__c ];
        }
        Map<string,Prescription__c> mapOfPrescriptions=new Map<string,Prescription__c>();
        if(RXList.size()>0){
        for(Prescription__c p:RXList){
            mapOfPrescriptions.put(p.ProductCode__c,p);
        } 
        }
        system.debug('orderItemrec'+orderItemrecs);
        
        for(OrderItem OI:orderItemrecs){
            ProductWrapper pw=new ProductWrapper();
            pw.OrderProduct=OI;
           
            if(mapOfPrescriptions.get(OI.ProductCode__c)!=null){
            pw.Prescription= mapOfPrescriptions.get(OI.ProductCode__c);
            if(mapOfPrescriptions.get(OI.ProductCode__c).RX_Number__c !=null){
                pw.OrderProduct.RX_Number__c=mapOfPrescriptions.get(OI.ProductCode__c).RX_Number__c;}
            }
           
           prodWrapperList.add(pw);
        } 
        system.debug('@@@@@@@@@@@@prodWrapperList'+prodWrapperList);
        return prodWrapperList;
        
        
    }
     
    public class ProductWrapper{
         @AuraEnabled 
         public OrderItem OrderProduct;
          @AuraEnabled
        Public Prescription__c Prescription;
        
    }
    
    
    @AuraEnabled
    public static Decimal getQuantityInstockinfo(Id OrderId,string productName){
     Decimal AvailableQuantity=0.0;
   
          asset a=[select id,name,Available_Quantity__c,Quantity_In_Stock__c  
                   from asset 
                   where product2.Name=:productName
                   AND Product2.IsActive = true];
        
      system.debug('a.Available_Quantity__c'+a.Available_Quantity__c);
      if(a.Available_Quantity__c >0)
      {
         AvailableQuantity =a.Available_Quantity__c; 
      }
        else{
           AvailableQuantity=0.0; 
        }
        
        return AvailableQuantity;
   }
    
         
     @AuraEnabled
    public static void SaveOrderItemInsurance(Id OrderId, List<Product_Insurance__c> ProductInsuranceInsertList,string insuranceRecordsjsonString){
        List<Product_Insurance__c> ProductInsuranceList=new List<Product_Insurance__c>();
          //List<Product_Insurance__c> ProductInsurancetListForInsert=(List<Product_Insurance__c>) JSON.deserialize(insuranceRecordsjsonString, List<Product_Insurance__c>.class);
           system.debug('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ProductInsuranceInsertList'+ProductInsuranceInsertList);
        for(Product_Insurance__c PI:ProductInsuranceInsertList){
            Product_Insurance__c ProInsurance=new Product_Insurance__c();
            ProInsurance.Insurance_Coverage__c=pi.Insurance_Coverage__c;
            ProInsurance.PA_Number__c=pi.PA_Number__c;
            ProInsurance.Order_Product__c=pi.Order_Product__c;
            ProductInsuranceList.add(ProInsurance);
        }
        upsert ProductInsuranceList;
          system.debug('@@rr@@@@'+ProductInsuranceList);  
    }
     @AuraEnabled
    public static   list<OrderItem> getPrescriptionList(String ClientId) {
       list<OrderItem> activeProds= [Select Id,Prescription_Profile__c,Prescription_Profile__r.Target__c,Prescription_Profile__r.Low__c,Prescription_Profile__r.High__c,Previous_Quantity__c,Product2.Name,Quantity_Needed__c from OrderItem where Prescription__r.Client_Chart__r.id =: ClientId];
       system.debug('activeProds'+activeProds);
        return activeProds;
        
    }
     @AuraEnabled
    public static  Client_Chart__c getClientChatDetails(String RecordId) {
        Order ord=getOrderDetails(RecordId);
        Client_Chart__c c=[select id,PHS_Qualified__c from Client_Chart__c where id=:ord.Client_Chart__c];
        return c;
    }
    
    
     @AuraEnabled
    public static  List<asset> getAssetDetails(String ProductId) {
    
        List<asset> ListOfAssets=new List<asset>();
       ListOfAssets=[select id,Cost_Code__c,Expiration_Date__c,INVDet__c,Lot__c,Quantity_In_Stock__c,Strength__c,Available_Quantity__c,Owner.Name,Quantity from asset where Product2.Id=:ProductId];
    return ListOfAssets;
    }
}