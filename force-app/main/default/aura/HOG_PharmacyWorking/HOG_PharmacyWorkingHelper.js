({
	createRXObjectData: function(component, event) {
        // get the contactList from component and add(push) New Object to List  
        var OrderProductList = component.get("v.RXOrderItemList");
        
        OrderProductList.push({
            'sobjectType': 'OrderItem',
            'Product2.Name': '',
            'Dosage__c':'',
            'Previous_Quantity__c': '',
            'Quantity_On_Hand__c': '',
            'Quantity_Needed__c': '',
            'Rx_Number__c': '',
            'PANumber__c': '',
            'Insurance__c': ''
        });
        component.set("v.RXOrderItemList", OrderProductList);
        
    },
    
    SelectedProfileHelper: function(component, event, selectedRecordsIds) {
  //call apex class method
  var action = component.get('c.selectedRecords');
  // pass the all selected record's Id's to apex method 
  action.setParams({
   "lstRecordId": selectedRecordsIds
  });
  action.setCallback(this, function(response) {
   //store state of response
   var state = response.getState();
   if (state === "SUCCESS") {
    console.log(state);
        var result =response.getReturnValue();
        alert('result'+JSON.stringify(result));
       component.set("v.PrescriptionProfileItemList", result);
       component.set("v.display", true);
            component.set("v.isOpen", false);
   }
  });
  $A.enqueueAction(action);
 },
    
     createsupplyObjectData: function(component, event) {
        // get the contactList from component and add(push) New Object to List  
        var RowItemList = component.get("v.SupplyOrderItemList");
        RowItemList.push({
            'sobjectType': 'OrderItem',
            'Category__c': '',
            'ProductCode__c': '',
            'Previous_Quantity__c': '',
            'Quantity_Needed__c':'',
            'Quantity_In_Stock__c':''
            
        });
        // set the updated list to attribute (contactList) again    
        component.set("v.SupplyOrderItemList", RowItemList);
        
    }
})