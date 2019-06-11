({
    doinit : function(component, event,helper) {
        
        var action = component.get("c.getProducts");
        action.setCallback(this, function(response){
            var result =response.getReturnValue();
            // alert('Prodlst'+JSON.stringify(result));
            component.set("v.prodlist",result);
            
        });
        $A.enqueueAction(action);
        
        helper.getQuntyNeededPickListValues(component, event);
        helper.getquantyhandsPickListValues(component, event);
        
    },addRow: function(component, event, helper) {
        helper.addOrderProdRecord(component, event);
    },
    
    removeRow: function(component, event, helper) {
        //Get the account list
        var OrderProductList = component.get("v.OrderProductList");
        //Get the target object
        var selectedItem = event.currentTarget;
        //Get the selected item index
        var index = selectedItem.dataset.record;
        OrderProductList.splice(index, 1);
        component.set("v.OrderProductList", OrderProductList);
    }
})