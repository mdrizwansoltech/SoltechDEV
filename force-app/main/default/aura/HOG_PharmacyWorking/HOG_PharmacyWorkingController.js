({
	doInit : function(component, event, helper) {
		
	},
     PassingtoOrderInstructions : function(component, event, helper){
        var orderRecord = component.get('v.order');
        
        var OrderId = component.get('v.orderId');
         orderRecord.Id =  OrderId;
         orderRecord.Order_Step__c =  'Order Instructions' ;  
         alert('PassingtoOrderInstructions'+component.get('v.orderId'));	
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
    backtoOrderReview: function(component, event, helper){
        var orderRecord = component.get('v.Order');
            
         orderRecord.Id =  component.get('v.recordId');
         orderRecord.Order_Step__c =  'Order Review' ;  
          	
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

    
     RXaddRow: function(component, event, helper) {
            alert('RXaddRow');
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
    
    removeDeletedRXRow: function(component, event, helper) {
        
        // get the selected row Index for delete, from Lightning Event Attribute  
        var index = event.getParam("indexVar");
        // get the all List (OrderItem attribute) and remove the Object Element Using splice method    
        var AllRowsList = component.get("v.RXOrderItemList");
        AllRowsList.splice(index, 1);
        // set the OrderItemList after remove selected row element  
        component.set("v.RXOrderItemList", AllRowsList);
    },
    
    print: function(component, event, helper) {
        var items=component.find("chk1");
        
       // alert("items,"+items);
        var selected=[];
        var len=items.length;
        alert("len"+len);
        for(var i=0; i<len; i++){
            
            if(items[i].type=="checkbox" && items[i].checked==true)
                alert("true");
            selected.push(items[i].value);
            
        }
        if (selected.length > 0) {
            //alert("Selected values: " + selected.join(","));
            
        }
        
        window.print();
    },
    navigateToOrderview : function(component, event, helper){

    var action = component.get("c.getListViews");
        alert('test');
    action.setCallback(this, function(response){
        var state = response.getState();
        if (state === "SUCCESS") {
            var listviews = response.getReturnValue();
            alert(JSON.stringify(listviews));
            var navEvent = $A.get("e.force:navigateToList");
            navEvent.setParams({
                "listViewId": listviews.Id,
                "listViewName": null,
                "scope": "Order"
            });
            navEvent.fire();
        }
    });
    $A.enqueueAction(action);
},
    addProfileMethod : function(component, event, helper){
        var action = component.get('c.getPrescriptionList');
        var clientIDval = component.get("v.Order");
        alert('clientIDval'+JSON.stringify(clientIDval));
        alert('ClientId'+clientIDval.Client_Chart__r.Id);
        action.setParams({  		
            ClientId  : clientIDval.Client_Chart__r.Id
        });  		
        		
        action.setCallback(this, function(response) {  		
            var state = response.getState();  		
            if ( state === 'SUCCESS' ) { 
                 var listview = response.getReturnValue();
            alert(JSON.stringify(listview));
                component.set("v.PrescriptionItemList",listview); 		
            } 		
        });  		
        $A.enqueueAction(action);  
        // for Display Model,set the "isOpen" attribute to "true"
        component.set("v.isOpen", true);
        
    },
    
     closeModel: function(component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle" 
        
        component.set("v.isOpen", false);
     },
    onSelectCheckbox : function(component, event, helper) {
  
    },
 	SelectedProfiles : function(component, event, helper) {
      var selId = [];
  // get all checkboxes 
  var getAllId = component.find("checkbox");
  // If the local ID is unique[in single record case], find() returns the component. not array
     if(! Array.isArray(getAllId)){
         if (getAllId.get("v.value") == true) {
           selId.push(getAllId.get("v.text"));
              
         }
     }else{
     // play a for loop and check every checkbox values 
     // if value is checked(true) then add those Id (store in Text attribute on checkbox) in selId var.
     for (var i = 0; i < getAllId.length; i++) {
       if (getAllId[i].get("v.value") == true) {
         selId.push(getAllId[i].get("v.text"));
           
       }
      }
        
     } 
    alert('selId'+selId);
        
        if(selId != '') {
          
        }
     // call the helper function and pass all selected record id's.    
      helper.SelectedProfileHelper(component, event, selId);
	},
    OpenPHPVarification: function(component, event, helper) {
        component.set('v.isPHPOpen',true);
        
        var opts = [
             { class: "optionClass", label: "NON-PHP", value: "NON-PHP" },
            { class: "optionClass", label: "PHP", value: "PHP" },
           
           
           
        ];
        component.find("InputSelectDynamic").set("v.options", opts);
         var OrderRecId = component.get("v.OrderId");
        
          var action = component.get("c.getClientChatDetails");
         action.setParams({  		
            RecordId  : OrderRecId
        });
           action.setCallback(this, function(response){
        var state = response.getState();
        if (state === "SUCCESS") {
            var PHPResult = response.getReturnValue();
           // alert(PHPResult.PHS_Qualified__c);
            if(PHPResult.PHS_Qualified__c){
              component.find("InputSelectDynamic").set("v.value","PHP");  
            } 
            else{
                 component.find("InputSelectDynamic").set("v.value","NON-PHP");
            }
        }
    });
    $A.enqueueAction(action);
        
        
        
    },
    onSelectChange : function(component, event, helper) {
    var selected = component.find("costcodes").get("v.value");
    //do something else
},
            CancelPHPVarification: function(component, event, helper) {
            component.set('v.isPHPOpen',false);
            component.set('v.isManuallySectionOpen',false);

            },
              NextPHPVarification: function(component, event, helper) {
             component.set('v.isPHPOpen',false);
            component.set('v.isManuallySectionOpen',true);
            
            }
            
            
            
  
 })