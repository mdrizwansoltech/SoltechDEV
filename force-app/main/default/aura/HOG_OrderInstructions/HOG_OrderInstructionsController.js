({ 
    doInit: function(component, event, helper) {
        
    },
    Next: function(component, event, helper) {
      
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle" 
        //alert('Record is saved Successfully');
        helper.showToast('Success','Success Message','Record is saved Successfully'); 
        
    },
    handleSubmit : function(component, event, helper) {
        var DeliverByDate = component.find("DeliverByDateID").get("v.value");
        var Instructions = component.find("Instructions").get("v.value");
        var CurrentDate = new Date();
        var DeliverByDate1 = new Date(DeliverByDate);
        
        if(DeliverByDate === "" || DeliverByDate === null ||  DeliverByDate === undefined ) {
            helper.showToast('error','Error Message','Delivery By Date Should not be Blank'); 
            
        }
        if ( DeliverByDate1 < CurrentDate ) {
            helper.showToast('error','Error Message','Delivery By Date Should be greater or Equal to todays date'); 
            
        }
        if(Instructions == undefined || Instructions == '' || Instructions == null){
            helper.showToast('error','Error Message','Please Enter Instructions before Proceeding');
            event.preventDefault(); // stop form submission
        } 
        else{
            helper.showToast('Success','Success Message','Record is saved Successfully'); 
        }
       
        
    },
    Previous : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:HOG_UpdateInsurance",
            componentAttributes: {  
                recordId : component.get("v.orderId")
            }
        });
        evt.fire();
    },openModel: function(component, event, helper) {
      // for Display Model,set the "isOpen" attribute to "true"
      component.set("v.isOpen", true);
   },
 
   closeModel: function(component, event, helper) {
      // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
      component.set("v.isOpen", false);
   },
    
    PassingtoOrderReview : function(component, event, helper){
          
       if (helper.validateRequired(component, event, helper)) { 
            
        var orderRecord = component.get('v.Order');
        var DeliverByDate = component.find("DeliverByDateID").get("v.value");
        var Instructions = component.find("Instructions").get("v.value");
                   
        var DeliverByDate1 = $A.localizationService.formatDate(DeliverByDate, "YYYY-MM-DD");
        var Rhpconsultant = component.find("Rhpconsultant").get("v.value"); 
         orderRecord.Id =  component.get('v.recordId');
         orderRecord.Order_Step__c =  'Order Review' ;
         orderRecord.Deliver_By_Date__c =  DeliverByDate ;
         orderRecord.Instructions__c =  Instructions ;
         orderRecord.RPH_Consult__c =  Rhpconsultant ;
         orderRecord.Status =  'Order Verify' ; 
          	var orderId = component.get('v.orderId');
            var action = component.get('c.createOrderRec');
            action.setParams({"orderRecord" : orderRecord});
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
       }else{ 
           
        } 
    },
    backtoAddOrderItems: function(component, event, helper){
        var orderRecord = component.get('v.Order');
            
         orderRecord.Id =  component.get('v.recordId');
         orderRecord.Order_Step__c =  'Add Order Items' ;  
          	
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
        
    }
})