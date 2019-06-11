({
	 doInit: function(component, event, helper) {
        //helper.fetchPickListVal(component, 'Product_Group__c', 'Category');
         helper.getSupplyProductgroup(component, event,'Category'); 
         helper.getSupplyProducts1(component, event,'Products');
       
       var category = component.find("Category").get("v.value");
         if(category != null || category != '' || category != undefined){
       
       // helper.GetQuantityInstock(component, event, helper);
       var product=event.getSource().get("v.value");
        var Category = component.set('v.Category');
                  
        helper.getPreOrderItems(component, event, helper,product,Category); 
           
     }
    },
    onPicklistChange: function(component, event, helper) {
        
        var Category = event.getSource().get("v.value");
       // alert(component.find("Products").get("v.value"));
        
        helper.getSupplyProducts(component, event,'Products',Category);
        component.set('v.Category',Category);
        
    },
    AddNewRow : function(component, event, helper){
       // fire the AddNewRowEvt Lightning Event 
        component.getEvent("AddRowEvt").fire();     
    },
    removeRow : function(component, event, helper){
     // fire the DeleteRowEvt Lightning Event and pass the deleted Row Index to Event parameter/attribute
       component.getEvent("HOG_SupplyDeleteRowEvt").setParams({"indexVar" : component.get("v.rowIndex") }).fire();
    },
    GetProductStock:function(component, event, helper){
       // alert('GetProductStock');
    var product=event.getSource().get("v.value");
    var Category = component.set('v.Category');
   // alert(product);
    helper.GetQuantityInstock(component, event, helper,product);
    helper.getPreOrderItems(component, event, helper,product,Category);    
   }
})