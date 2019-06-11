({
	getQuntyNeededPickListValues : function(component, event) {
        
        var action = component.get("c.getPickListValues");
        action.setParams({ obj:"OrderItem",str:"Quantity_Needed__c"});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
                
                component.set("v.options", stringItems); 
            }
        });
        $A.enqueueAction(action);
    },
    
    getquantyhandsPickListValues : function(component, event) {
        
        var action = component.get("c.getPickListValues");
        action.setParams({ obj:"OrderItem",str:"Quantity_On_Hand__c"});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
              //  alert(JSON.stringify(response.getReturnValue()))
                component.set("v.options1", stringItems); 
            }
        });
        $A.enqueueAction(action);
    }, addOrderProdRecord: function(component, event) {
        
        //get the account List from component  
        var OrderProductList = component.get("v.OrderProductList");
        //Add New Account Record
        OrderProductList.push({
            'sobjectType': 'OrderItem',
            'Product2Id': '',
            'Previous_Quantity__c': '',
            'Quantity_On_Hand__c': '',
            'Quantity_Needed__c': '',
            'UnitPrice': ''
        });
        component.set("v.OrderProductList", OrderProductList);
    },
})