({
    doinit : function(component, event,helper) {
        var action = component.get("c.getProducts");
        action.setCallback(this, function(response){
            var result =response.getReturnValue();
            //  alert('Prodlst'+JSON.stringify(result));
            component.set("v.prodlist",result);
            
        });
        $A.enqueueAction(action);
        
        helper.getSupplyProducts(component, event);
        helper.getQuntyNeededPickListValues(component, event);
        helper.getquantyhandsPickListValues(component, event); 
        helper.getActivePrescriptionProducts(component, event);
        helper.getTempRecords(component, event);
        helper.getcategoryPickListValues(component, event);
    },
    rxAddRow: function(component, event, helper) {
        
        helper.addOrderProdRecord(component, event);
        
    },
    supplyCatprodData: function(component, event) {
        //alert('INsupplyCatprodData');
        
        var selectedCategory = component.find("Categoryid").get("v.value");
        //alert('selectedCategory::'+selectedCategory);
        
        var action = component.get("c.getsupplyCatprod");
        action.setParams({
            "selectedCategory" : selectedCategory
        });
        action.setCallback(this, function(response){
            var result =response.getReturnValue();
           // alert('Prodlst'+JSON.stringify(result));
            component.set("v.supplyprodlist",result);
            
        });
        $A.enqueueAction(action);
    },
    supplyaddRow: function(component, event, helper) {
        
       // alert('InsidesupplyaddOrderProdRecord');
        
        var supplyOrderProductList = component.get("v.supplyOrderProductList");
        
        supplyOrderProductList.push({
            'sobjectType': 'OrderItem',
            'Product2.Category__c': '',
            'Product2.Name': '',
            'Previous_Quantity__c': '',
            'Quantity_Needed__c': '',
            'Quantity_In_Stock__c': '',
            'UnitPrice': ''
        });
        component.set("v.supplyOrderProductList", supplyOrderProductList);
        //   helper.getSupplyProducts(component, event);
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
    },
    goToOrder: function(component, event, helper) {
        // if (helper.validateAccountList(component, event)) {
        helper.saveOrderprodList(component, event);
        // }
    },
    copyLastOrderRX: function(component, event, helper) {
        
        var action = component.get("c.getPreOrderItem");
       
        action.setParams({ OrderId:component.get("v.recordId")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
               // alert(JSON.stringify(response.getReturnValue()))
                component.set("v.copyLastorderItem", stringItems); 
                var OrderProductList = component.get("v.copyLastorderItem"); 
                
                component.set("v.OrderProductList", OrderProductList);
            }
        });
        $A.enqueueAction(action);
    },
    
    Previous : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:HOG_UpdateInsurance",
            componentAttributes: {  
                OrderId : component.get("v.recordId")
            }
        });
        evt.fire();
    },
    
    PassingtoOrderInstructions : function(component, event, helper){
        var orderRecord = component.get('v.order');
        
        var OrderId = component.get('v.orderId');
        orderRecord.Id =  OrderId;
        orderRecord.Order_Step__c =  'Order Instructions' ;  
        //  alert('PassingtoOrderInstructions'+component.get('v.orderId'));	
        var action = component.get('c.createOrderRec');
        action.setParams({
            "orderRecord" : orderRecord
        });
        action.setCallback(this, $A.getCallback(function (response) {
            
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Success Message',
                message: 'Order created Successfully',
                messageTemplate: 'Record {0} created! See it {1}!',
                duration:' 5000',
                key: 'info_alt',
                type: 'success',
                mode: 'pester'
            });
            // toastEvent.fire();
            var state = response.getState();
            if (state === "SUCCESS") {
                var untitleProject = response.getReturnValue();
                message = 'Order Updated Successfully.';
                //Redirecting to shipping component along with orderId and clientId
                
                var GetOrderStep = component.getEvent('HOG_GetOrderStep');
                GetOrderStep.setParams({
                    "nextstep"    :    "2" 
                }); 
                GetOrderStep.fire();
            } 
            
            else {
                var toastEvent = $A.get("e.force:showToast");
                var message = '';
                if (state === "INCOMPLETE") {
                    message = 'Server could not be reached. Check your internet connection.';
                } else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        for(var i=0; i < errors.length; i++) {
                            for(var j=0; errors[i].pageErrors && j < errors[i].pageErrors.length; j++) {
                                message += (message.length > 0 ? '\n' : '') + errors[i].pageErrors[j].message;
                            }
                            if(errors[i].fieldErrors) {
                                for(var fieldError in errors[i].fieldErrors) {
                                    var thisFieldError = errors[i].fieldErrors[fieldError];
                                    for(var j=0; j < thisFieldError.length; j++) {
                                        message += (message.length > 0 ? '\n' : '') + thisFieldError[j].message;
                                    }
                                }
                            }
                            if(errors[i].message) {
                                message += (message.length > 0 ? '\n' : '') + errors[i].message;
                            }
                        }
                    } else {
                        message += (message.length > 0 ? '\n' : '') + 'Unknown error';
                    }
                }
                toastEvent.setParams({
                    title: 'Error',
                    type: 'error',
                    message: message
                });
                toastEvent.fire();
            }//Error code ends 
            
        }));
        $A.enqueueAction(action);
        
        
    },
    backtoUpdateInsurance: function(component, event, helper){
        var orderRecord = component.get('v.order');
        
        orderRecord.Id =  component.get('v.orderId');
        orderRecord.Order_Step__c =  'Update Insurance' ;  
        var orderId = component.get('v.orderId');
        var action = component.get('c.createOrderRec');
        action.setParams({
            
            "orderRecord" : orderRecord
            
        });
        action.setCallback(this, $A.getCallback(function (response) {
            
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Success Message',
                message: 'Order created Successfully',
                messageTemplate: 'Record {0} created! See it {1}!',
                duration:' 5000',
                key: 'info_alt',
                type: 'success',
                mode: 'pester'
            });
            // toastEvent.fire();
            var state = response.getState();
            if (state === "SUCCESS") {
                var untitleProject = response.getReturnValue();
                message = 'Order Updated Successfully.';
                //Redirecting to shipping component along with orderId and clientId
                
                var GetOrderStep = component.getEvent('HOG_GetOrderStep');
                GetOrderStep.setParams({
                    "nextstep"    :    "3" 
                }); 
                GetOrderStep.fire();
            } 
            
            else {
                var toastEvent = $A.get("e.force:showToast");
                var message = '';
                if (state === "INCOMPLETE") {
                    message = 'Server could not be reached. Check your internet connection.';
                } else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        for(var i=0; i < errors.length; i++) {
                            for(var j=0; errors[i].pageErrors && j < errors[i].pageErrors.length; j++) {
                                message += (message.length > 0 ? '\n' : '') + errors[i].pageErrors[j].message;
                            }
                            if(errors[i].fieldErrors) {
                                for(var fieldError in errors[i].fieldErrors) {
                                    var thisFieldError = errors[i].fieldErrors[fieldError];
                                    for(var j=0; j < thisFieldError.length; j++) {
                                        message += (message.length > 0 ? '\n' : '') + thisFieldError[j].message;
                                    }
                                }
                            }
                            if(errors[i].message) {
                                message += (message.length > 0 ? '\n' : '') + errors[i].message;
                            }
                        }
                    } else {
                        message += (message.length > 0 ? '\n' : '') + 'Unknown error';
                    }
                }
                toastEvent.setParams({
                    title: 'Error',
                    type: 'error',
                    message: message
                });
                toastEvent.fire();
            }//Error code ends 
            
        }));
        $A.enqueueAction(action);
        
    },
    //Supply Methods starts here
    addTemplateItems: function(component, event){  
        var selectedTemplate = component.find("temName").get("v.value");
        
        var action = component.get("c.getselectedTemplate");
        
        action.setParams({ "selectedTemplate":selectedTemplate});
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                var stringItems = response.getReturnValue();
                
                component.set("v.selectedTemProds", stringItems); 
                var supplyOrderProductList = component.get("v.selectedTemProds"); 
                component.set("v.supplyOrderProductList", supplyOrderProductList);
            }
        });
        $A.enqueueAction(action);
    },
    
    supplyremoveRow: function(component, event, helper) {
        
        var supplyOrderProductList = component.get("v.supplyOrderProductList");
        //Get the target object
        var selectedItem = event.currentTarget;
        //Get the selected item index
        var index = selectedItem.dataset.record;
        supplyOrderProductList.splice(index, 1);
        component.set("v.supplyOrderProductList", supplyOrderProductList);
    },
    
    save: function(component, event, helper) {
        // if (helper.validateAccountList(component, event)) {
        helper.saveOrderprodList(component, event);
        // }
    },
    goToPrevOrder : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.recordId"),
            "slideDevName": "Details"
        });
        navEvt.fire();
    },
    copyLastOrdersupplyRX: function(component, event, helper) {
        
        var action = component.get("c.getPresupplyItem");
       
        action.setParams({ OrderId:component.get("v.recordId")});
       
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
                 
                component.set("v.supplycopyLastorderItem", stringItems); 
                var supplyOrderProductList = component.get("v.supplycopyLastorderItem"); 
               
                component.set("v.supplyOrderProductList", supplyOrderProductList);
                
                //--------second controller Starts--------------
                
                var action_2 = component.get("c.getPreOrderItem");
                action_2.setParams({ OrderId:component.get("v.recordId") });
                action_2.setCallback(this, function(response) {
                    var state = response.getState();
                    
                    if (state === "SUCCESS") 
                    {
                        var stringItems = response.getReturnValue();
                       // alert(JSON.stringify(stringItems));
                        component.set("v.copyLastorderItem", stringItems);
                        
                        var OrderProductList = component.get("v.copyLastorderItem"); 
                        component.set("v.OrderProductList", OrderProductList);
                    }
                });
                $A.enqueueAction(action_2);
                
            }
        });
        $A.enqueueAction(action);
        
    },
    
})