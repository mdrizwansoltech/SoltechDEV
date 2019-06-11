({
	 doInit: function(component, event, helper) {
        //helper.fetchPickListVal(component, 'Product_Group__c', 'ProductGroup');
        //helper.fetchPickListProdVal(component, 'ProductCode', 'Products');
        helper.getFactorRXProducts(component, event,'ProductGroup'); 
         
    },
    onPicklistChange: function(component, event, helper) {
        
        var ProductGroup = event.getSource().get("v.value");
       // alert(component.find("Products").get("v.value"));
        
        helper.getRXProducts(component, event,'Products',ProductGroup);
        component.set('v.Category',ProductGroup);
        
    },
    
    AddNewRow : function(component, event, helper){
       // fire the AddNewRowEvt Lightning Event 
        component.getEvent("AddRowEvt").fire();     
    },
    removeRow : function(component, event, helper){
        
     // fire the DeleteRowEvt Lightning Event and pass the deleted Row Index to Event parameter/attribute
       component.getEvent("HOG_RXDeleteRowEvt").setParams({"indexVar" : component.get("v.rowIndex") }).fire();
    },
    getrxPreOrderItems:function(component, event, helper){
        
    var product=event.getSource().get("v.value");
    // alert('product'+product);
    helper.getPriorAuthorizationMethod(component, event,'priorAuthID',product);
    helper.getRXPreOrderItems(component, event, helper,product);    
   }
})