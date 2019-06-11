({
    doInit: function(component, event, helper) {
        // create a Default RowItem [OrderItem Instance] on first time Component Load
        // by call this helper function 
         
        helper.getTempRecords(component, event);
        helper.getorderitems(component, event);          
        
    },
    RXaddRow: function(component, event, helper) {
        // call the comman "createObjectData" helper method for add new Object Row to List  
        helper.createRXObjectData(component, event);
    },
    supplyaddRow: function(component, event, helper) {
        // call the comman "createObjectData" helper method for add new Object Row to List  
        helper.createsupplyObjectData(component, event);
    },
    removeDeletedRXRow: function(component, event, helper) {
        
        // get the selected row Index for delete, from Lightning Event Attribute  
        var index = event.getParam("indexVar");
        // get the all List (OrderItem attribute) and remove the Object Element Using splice method    
        var AllRowsList = component.get("v.RXOrderItemList");
        AllRowsList.splice(index, 1);
        // set the OrderItemList after remove selected row element  
        component.set("v.RXOrderItemList", AllRowsList);
    },
    removeDeletedSupplyRow: function(component, event, helper) {
        // get the selected row Index for delete, from Lightning Event Attribute  
        var index = event.getParam("indexVar");
        // get the all List (OrderItem attribute) and remove the Object Element Using splice method    
        var AllRowsList = component.get("v.SupplyOrderItemList");
        AllRowsList.splice(index, 1);
        // set the OrderItemList after remove selected row element  
        component.set("v.SupplyOrderItemList", AllRowsList);
    },
    addTemplateItems: function(component, event){  
        var selectedTemplate = component.find("temName").get("v.value");
        
        var action = component.get("c.getselectedTemplate1");
        
        action.setParams({ "selectedTemplate":selectedTemplate});
         var supplytemplist =[];
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if (state === "SUCCESS") {
                
                var orderItemList =[] ;
                var stringItems = response.getReturnValue();
                
                for(var i=0;i<stringItems.length;i++){
                     var record = stringItems[i];
                    var Item = {ProductCode__c : record.Product2.ProductCode, 
                                Category__c: record.Product2.Category__c,
                                Product_Group__c: record.Product2.Product_Group__c,
                                Quantity_In_Stock__c:record.Quantity_In_Stock__c};
                     supplytemplist.push(Item);
                    }
                
                component.set("v.SupplyOrderItemList", supplytemplist);
                /*if(component.get("v.SupplyOrderItemList") != undefined){
        
                        var childCmp = component.find("SupplyProductRowItem");
                        var retnMsg = childCmp.GetProductStock();
                    }*/
                
                
            }
        });
        $A.enqueueAction(action);
    },
    copyLastOrderRX: function(component, event, helper) {
        
        var Order = component.get("v.Order");
        var preordID = Order.Previous_Order_ID__c;
        if(preordID != undefined && preordID != null && preordID != ''){
            
            var action = component.get("c.getPreOrderItem");
            action.setParams({ RxPreordID : preordID});
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    
                    var stringItems = response.getReturnValue();
                    for(var i=0;i<stringItems.length;i++){
                    
                    stringItems[i].Quantity_Needed__c = '';
                    stringItems[i].Quantity_On_Hand__c = '';
                     
                }
                     
                    component.set("v.RXOrderItemList", stringItems); 
                   
                    
                }
            });
            $A.enqueueAction(action);
        }
    },PassingtoOrderInstructions : function(component, event, helper){
        
       if (helper.validateRequired(component, event)) { 
        var orderRecord = component.get('v.Order');
        orderRecord.Id =  component.get("v.recordId");
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
               // message: 'Order created Successfully',
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
               // message = 'Order Updated Successfully.';
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
        
        helper.saveOrderprodfromorderitem(component, event, helper); 
       }    
           
    },
    backtoUpdateInsurance: function(component, event, helper){
       
        var orderRecord = component.get('v.Order');
        orderRecord.Id =  component.get("v.recordId");
        orderRecord.Order_Step__c = 'Update Insurance';  
        var orderId = component.get('v.OrderId');
        
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
    copyLastOrdersupplyRX: function(component, event, helper) {
        var previousOrder = component.get("v.Order");
        var preordID = previousOrder.Previous_Order_ID__c;
        var action = component.get("c.getPresupplyItem");
        action.setParams({ supplyPreordID :preordID});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
                
                for(var i=0;i<stringItems.length;i++){
                    
                    stringItems[i].Quantity_Needed__c = '';
                    stringItems[i].Quantity_On_Hand__c = '';
                     
                }
               
                component.set("v.SupplyOrderItemList", stringItems);                
                
                //--------second controller Starts--------------
                
                
                var previousOrder = component.get("v.Order");
                var preordID = previousOrder.Previous_Order_ID__c;
                var action_2 = component.get("c.getPreOrderItem");
                action_2.setParams({ RxPreordID : preordID });
                action_2.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") 
                    {
                        var stringItems = response.getReturnValue();
                        component.set("v.RXOrderItemList", stringItems);
                    }
                });
                $A.enqueueAction(action_2);
                
            }
        });
        $A.enqueueAction(action);
        
    },
    goToPrevOrder : function(component, event, helper) {
        var previousOrder = component.get("v.Order");
        var preordID = previousOrder.Previous_Order_ID__c;
        
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": preordID ,
            "slideDevName": "Details"
        });
        navEvt.fire();
    },
})