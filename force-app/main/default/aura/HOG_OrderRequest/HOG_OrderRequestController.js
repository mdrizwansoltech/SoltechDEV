({  doinit : function(component, event,helper) {
  
    var r=component.get('v.recordId');
   
    helper.getOrdInsuranceRecords(component, event);
        helper.getorderDetails(component, event);
    helper.getorderStatus(component, event);
        helper.getorderitems(component, event);
        //helper.tempmes(component, event);
        helper.getSupplyProducts(component, event);
        helper.getQuntyNeededPickListValues(component, event);
        helper.getquantyhandsPickListValues(component, event); 
        helper.getTempRecords(component, event);
        helper.getcategoryPickListValues(component, event);
        helper.getTempRecords(component, event);
        helper.createsupplyObjectData(component, event);
    //alert(component.get('v.recordId'));
    var action = component.get("c.getProducts");
    action.setCallback(this, function(response){
            var result =response.getReturnValue();
        //  alert('Prodlst'+JSON.stringify(result));
            component.set("v.prodlist",result);
    
    });
    $A.enqueueAction(action);
       
},
	ChangeStatusvalues: function(component, event, helper) {
    },
        RXaddRow: function(component, event, helper) {
           
        // call the comman "createObjectData" helper method for add new Object Row to List  
        helper.createRXObjectData(component, event);
        
    },
     supplyaddRow: function(component, event, helper) {
        // call the comman "createObjectData" helper method for add new Object Row to List  
        helper.createsupplyObjectData(component, event);
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
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                var orderItemList =[] ;
                var stringItems = response.getReturnValue();
                
                component.set("v.SupplyOrderItemList", stringItems); 
            }
        });
        $A.enqueueAction(action);
    },
    removeRow: function(component, event, helper) {
        var RXOrderItemList = component.get("v.RXOrderItemList");
        var selectedItem = event.currentTarget;
        
        var index = selectedItem.dataset.record;
        RXOrderItemList.splice(index, 1);
        component.set("v.RXOrderItemList", RXOrderItemList);
    },
    goToOrder: function(component, event, helper) {
       // if (helper.validateAccountList(component, event)) {
            helper.saveOrderprodList(component, event);
       // }
    },
   copyLastOrderRX: function(component, event, helper) {
        var Order = component.get("v.Order");
       
        if(Order != undefined && Order != null && Order != ''){
            var preordID = Order.Previous_Order_ID__c;
            var action = component.get("c.getPreOrderItem");
            action.setParams({ RxPreordID : preordID});
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var stringItems = response.getReturnValue();
                 //   alert('copyLastOrderRX'+JSON.stringify(stringItems));
                    component.set("v.RXOrderItemList", stringItems); 
                    
                }
            });
            $A.enqueueAction(action);
        }
   },
   RXaddRow: function(component, event, helper) {
        // call the comman "createObjectData" helper method for add new Object Row to List  
        helper.createRXObjectData(component, event);
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
     supplyCatprodData: function(component, event) {
    
       var selectedCategory = component.find("Categoryid").get("v.value");
       var action = component.get("c.getsupplyCatprod");
        action.setParams({
            selectedCategory : selectedCategory
        });
        action.setCallback(this, function(response){
            var result =response.getReturnValue();
            // alert('Prodlst'+JSON.stringify(result));
            component.set("v.supplyprodlist",result);
            
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
    copyLastOrdersupplyRX: function(component, event, helper) {
        var previousOrder = component.get("v.Order");
        var preordID = previousOrder.Previous_Order_ID__c;
        var action = component.get("c.getPresupplyItem");
        action.setParams({ supplyPreordID :preordID});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
                
                component.set("v.supplycopyLastorderItem", stringItems); 
                var supplyOrderProductList = component.get("v.supplycopyLastorderItem"); 
                
                
                component.set("v.supplyOrderProductList", supplyOrderProductList);
                
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
    
	PassingtoPharmacyWorking : function(component, event, helper){
        
      // if (helper.validateRequired(component, event)) {  
        var sendorder = component.get('v.Order');
         sendorder.Id =  component.get('v.recordId');
         sendorder.Order_Step__c =  'Pharmacy Working' ;  
           var action = component.get('c.createOrderRec');
            action.setParams({
                       "orderRecord" : sendorder
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
                  
                 //   var appEvent = $A.get("e.c:HOG_ProductInsuranceCreationEvent");
                 //  appEvent.fire();
                     
                  
                    
                    
                    
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
        // helper.upsertOrderprodList(component,event);
      // } 
    },
    backtoOrderInstructions: function(component, event, helper){
        
        var sendorder = component.get('v.Order');
         sendorder.Id =  component.get('v.recordId');
         sendorder.Order_Step__c = 'Order Instructions' ;  
          	var orderId = component.get('v.recordId');
            var action = component.get('c.createOrderRec');
            action.setParams({
                
                "orderRecord" : sendorder
                
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
      onchangestatus1: function(component, event, helper){
            var statuschange = component.find("StatusValues").get("v.value");
         /* 
          if(statuschange == 'Insurance Verify' )
          {
              component.set("v.statusValue",true);
               component.set("v.InsurancestatusValue",false);
              
          }else{
              component.set("v.statusValue",false);
              component.set("v.InsurancestatusValue",true);
          }
          
          */
      },
  
  
    onchangestatus: function(component, event, helper){
        var statuschange = component.find("statuschange").get("v.value");
    var GetOrderStep = component.getEvent('HOG_StatusChangeEvent');
                    GetOrderStep.setParams({
                        "status"    :    statuschange
                    }); 
                    GetOrderStep.fire();
    },
  RefreshPage: function(component, event, helper) {
       
       // var params = event.getParams(); //get event params
       // var fields = params.response.fields;
      
       // var recordId = params.response.id; //get record id
      
        //  alert('Record is Created Successfully'); 
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Success Message',
            message: 'Order is updated Successfully',
            messageTemplate: 'Record {0} created! See it {1}!',
            duration:' 5000',
            key: 'info_alt',
            type: 'success',
            mode: 'pester'
        });
        toastEvent.fire();
        
      var statuschange = component.find("StatusValues").get("v.value");
     // alert(statuschange);
  //  var GetOrderStep = component.getEvent('HOG_StatusChangeEvent');
      var getOrderStatus = $A.get("e.c:HOG_RefreshChildComponentEvent");
                    getOrderStatus.setParams({
                        "OrderStatus"    :    statuschange
                    }); 
                    getOrderStatus.fire();
      
    // $A.get('e.force:refreshView').fire();
   // this.doinit(component, event, helper);
    helper.getorderitems(component, event);
      
        helper.getSupplyProducts(component, event);
      
    },
  handleOnSubmit : function(component, event, helper) {
      
       if (helper.validateRequired(component, event)) {
  var orderRec=component.get('v.Order');
    orderRec.Pharmacy__c= component.find("Pharmacy").get("v.value");
      orderRec.Client_Name__c=component.find("ClientName").get("v.value");
     // orderRec.Medical_Disorder__c= component.find("MedicalDisorder").get("v.value");
     // orderRec.Dosage_Range_From__c=  component.find("Severity").get("v.value");
    //  orderRec.Dosage_To__c=  component.find("DosageTo").get("v.value");
      orderRec.EffectiveDate=   component.find("EffectiveDate").get("v.value");
      orderRec.Deliver_By_Date__c=   component.find("DeliverByDate").get("v.value");
      orderRec.Placed_By__c=  component.find("PlacedBy").get("v.value");
      orderRec.RPH_Consult__c=   component.find("Rhpconsultant").get("v.value");
      orderRec.Ship_To_Name__c= component.find("ShipToName").get("v.value");
      orderRec.Street_Name1__c= component.find("StreetName").get("v.value");
       orderRec.Address_Line__c= component.find("AddressLine2").get("v.value");
       orderRec.City1__c= component.find("City").get("v.value");
       orderRec.State1__c= component.find("State").get("v.value");
      orderRec.Zip_Code1__c= component.find("ZipCode").get("v.value");
       orderRec.Ship_Via__c= component.find("ShipVia").get("v.value");
        orderRec.Signature__c= component.find("Signaturerequired").get("v.value");
        orderRec.Order_Notes__c= component.find("OrderNotes").get("v.value");
        orderRec.Phone__c= component.find("Phone").get("v.value");
        orderRec.Status= component.find("StatusValues").get("v.value");
       // orderRec.Level__c= component.find("Level").get("v.value");
      
        component.set('v.Order',orderRec);
          var action = component.get("c.SaveOrderDetails");
        action.setParams({
           OrderRecord :component.get('v.Order'),
            OrderId : component.get('v.recordId')
                     });
        action.setCallback(this, function(response){
            var state = response.getState();
            var opts = [];
               if (state === "SUCCESS") {
                           var result =response.getReturnValue();    
                   component.set('v.Order',result);
                 
                      helper.getorderStatus(component, event);
                   if(result.Status== 'Insurance Verify')
                  {
                      component.set("v.statusValue",true);
                       component.set("v.OrderSave",true);
                      
                     
                  }
                   
                   if(result.Status== 'Released')
                  {
                    helper.PassingtoPharmacyWorkingUsingOrder(component,event,helper);
                  }
                   
             
                }
            
            
        });
        $A.enqueueAction(action);
       
       helper.upsertOrderprodList(component,event);
           
       var appEvent = $A.get("e.c:HOG_ProductInsuranceCreationEvent");
       appEvent.fire();
           
           
        
        
                     
  } 
  }
})