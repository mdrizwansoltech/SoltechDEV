({
    doinit : function(component, event,helper) {
        var action = component.get("c.getSupplyProducts");
        action.setCallback(this, function(response){
            var result =response.getReturnValue();
            // alert('Prodlst'+JSON.stringify(result));
            component.set("v.prodlist",result);
            
        });
        $A.enqueueAction(action);
        
        helper.getQuntyNeededPickListValues(component, event);
        helper.getquantyhandsPickListValues(component, event);
        helper.getTempRecords(component, event);
    },
    addRow: function(component, event, helper) {
        
        helper.addOrderProdRecord(component, event);
        
    },
    addTemplateItems: function(component, event){  
        var selectedTemplate = component.find("temName").get("v.value");
        
        var action = component.get("c.getselectedTemplate");
        
        action.setParams({ "selectedTemplate":selectedTemplate});
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                var stringItems = response.getReturnValue();
                
                component.set("v.selectedTemProds", stringItems); 
                var OrderProductList = component.get("v.selectedTemProds"); 
                // alert('selectedTempProductList'+JSON.stringify(OrderProductList));
                // alert('Pusheddata'+JSON.stringify(OrderProductList));
                component.set("v.OrderProductList", OrderProductList);
            }
        });
        $A.enqueueAction(action);
    },
    
    removeRow: function(component, event, helper) {
        
        var OrderProductList = component.get("v.OrderProductList");
        //Get the target object
        var selectedItem = event.currentTarget;
        //Get the selected item index
        var index = selectedItem.dataset.record;
        OrderProductList.splice(index, 1);
        component.set("v.OrderProductList", OrderProductList);
    },
    save: function(component, event, helper) {
        // if (helper.validateAccountList(component, event)) {
        helper.saveOrderprodList(component, event);
        // }
    },
    goToOrder : function(component, event, helper) {
        
        alert('need to write the code yet');
    },
    copyLastOrdersupplyRX: function(component, event, helper) {
        
        var action = component.get("c.getPresupplyItem");
        
        action.setParams({ OrderId:component.get("v.recordId")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
                
                component.set("v.copyLastorderItem", stringItems); 
                var OrderProductList = component.get("v.copyLastorderItem"); 
                // alert(JSON.stringify(OrderProductList));
                
                component.set("v.OrderProductList", OrderProductList);
                
                //--------second controller Starts--------------
                
                var action_2 = component.get("c.getPreOrderItem");
                action.setParams({ OrderId:component.get("v.recordId") });
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    
                    if (state === "SUCCESS") 
                    {
                        var stringItems = response.getReturnValue();
                        component.set("v.rxCopyLastorderItem", stringItems);
                        var rxOrderProductList = component.get("v.rxCopyLastorderItem"); 
                        component.set("v.rxOrderProductList", rxOrderProductList);
                    }
                });
                $A.enqueueAction(action_2);
                
            }
        });
        $A.enqueueAction(action);
        
    },
})