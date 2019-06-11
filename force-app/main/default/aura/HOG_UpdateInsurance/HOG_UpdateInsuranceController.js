/* ******************************************************************************************************************************
* Copyright(C)2019
* Soltech
* All Rights Reserved
* Name      : HOG_UpdateInsuranceController.js
* Purpose   : This component is used  to show the Insurance information    

**********************************************************************************************************************************
*   Version No                   Name                           Date                                Description

* ================================================================================================================================
*        1.0                   Rizwan Mohammed                     04/05/2019                        Initial Version
				   
*********************************************************************************************************************************** */
({
    doInit:function(component, event, helper){
        
        //var orderRecId= event.getParam("OrderId");
        
        var orderRecId= component.get('v.orderId'); 
        if(orderRecId!=null && orderRecId!='' && orderRecId!=undefined){
            component.set('v.orderId',orderRecId);
        }
        //helper.GetClientName(component, event, helper);
        
        component.set("v.ClientName",component.get("v.order.Client_Chart__c"));
        // alert('list of inusrance orderRecId'+orderRecId);
        
        var action = component.get("c.getInsuranceInfo");
        action.setParams({OrderId : orderRecId});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state == "SUCCESS") {
                var Result = response.getReturnValue();
                if(response.getReturnValue()!=null && response.getReturnValue()!='' && response.getReturnValue()!=undefined && response.getReturnValue().length>0){
                    component.set("v.ListOfRecords", response.getReturnValue());
                }  
            }  
        });
        $A.enqueueAction(action);
        
        helper.SetOrderRecord(component, event, helper);
    },
    
    newInsuranceForm : function(component, event, helper) {
        component.set("v.isOpen",true);
    },
    
    OpenEditModel : function(component, event, helper) {
        var selectedId = event.currentTarget;
        var idstr = selectedId.getAttribute("data-IncId");
        var editRecordEvent = $A.get("e.force:editRecord");
        editRecordEvent.setParams({
            "recordId":idstr
        });
        editRecordEvent.fire();
        
    },
    handleToastEvent : function(component, event, helper) {
        var toastMessageParams = event.getParams();
        var message = toastMessageParams.message;
        var list = component.get("v.ListOfRecords");
     
        if (message.includes('was saved')) {
            //window.location.reload();
            
            helper.SetOrderRecord(component, event, helper);
        }
        
    },
    
    openModel: function(component, event, helper) {
        // for Display Model,set the "isOpen" attribute to "true"
        component.set("v.isOpen", true);
    },
    
    closeModel: function(component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        component.set("v.isOpen", false);
    },   
    SetOrderInformation: function(component, event, helper){
        var orderRecId= event.getParam("OrderId");
        //Fetch existing order record
        var action = component.get("c.getOrderDetails");
        
        action.setParams({"RecordId" :orderRecId});
        
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var Result = response.getReturnValue();
                
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            } else {
                console.log("Action State returned was: " + state);
            }
            
        });
        $A.enqueueAction(action);
    },
    
    closeModelForInsurance: function(component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle" 
        var params = event.getParams(); //get event params
        var fields = params.response.fields;
        // alert(fields);
        var recordId = params.response.id; //get record id
        // alert(recordId);
        component.set("v.InsuranceRecordId", recordId);
        helper.SetOrderRecord(component, event, helper);
        //  alert('Record is Created Successfully'); 
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Success Message',
            message: 'Record is created Successfully',
            messageTemplate: 'Record {0} created! See it {1}!',
            duration:' 2000',
            key: 'info_alt',
            type: 'success',
            mode: 'pester'
        });
        toastEvent.fire();
        
        
        if(recordId!=null && recordId!='' && recordId!=undefined){
            
            component.set("v.isOpen", false);
            // $A.get('e.force:refreshView').fire();
        }
    },
    
    handleSubmit : function(component, event, helper) {
        
        var PlanName = component.find("PlanName").get("v.value");
        var PlanType = component.find("PlanType").get("v.value");
        var PolicyType = component.find("PolicyType").get("v.value");
        var Category = component.find("Category").get("v.value");
        var PolicyNumber = component.find("PolicyNumber").get("v.value");
        var TerminationDate = component.find("TerminationDate").get("v.value");
        
        // perform validations as required based on the value retrieved
        if(PlanName === "" || PlanName === null ||  PlanName === undefined ) {
            helper.showToast('error','Error Message','Plan Name Should not be Blank'); 
            event.preventDefault(); // stop form submission
        }
        
        if(PlanType === "" || PlanType === null ||  PlanType === undefined ) {
            helper.showToast('error','Error Message','Plan Type Should not be Blank'); 
            event.preventDefault(); // stop form submission
        }
        if(PolicyType === "" || PolicyType === null ||  PolicyType === undefined ) {
            helper.showToast('error','Error Message','Policy Type Should not be Blank'); 
            event.preventDefault(); // stop form submission
        }
        if(Category === "" || Category === null ||  Category === undefined ) {
            helper.showToast('error','Error Message','Category Should not be Blank'); 
            event.preventDefault(); // stop form submission
        }
        if(PolicyNumber === "" || PolicyNumber === null ||  PolicyNumber === undefined ) {
            helper.showToast('error','Error Message','Policy Number Should not be Blank'); 
            event.preventDefault(); // stop form submission
        }
        if(TerminationDate === "" || TerminationDate === null ||  TerminationDate === undefined ) {
            helper.showToast('error','Error Message','Termination Date Should not be Blank'); 
            event.preventDefault(); // stop form submission
        }
        
    },
    Passingtoaddorderitems : function(component, event, helper){
        //('hi');
        if (helper.validateRequired(component, event,helper)) {
            var orderRecord = component.get('v.order');
            orderRecord.Id =  component.get('v.orderId');
            orderRecord.Order_Step__c =  'Add Order Items' ;  
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
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Error',
                message: 'Order Need to have atleast one in-force inusrance',
                messageTemplate: 'Record {0} created! See it {1}!',
                duration:' 5000',
                key: 'info_alt',
                type: 'error',
                mode: 'pester'
            });
            toastEvent.fire();
        }
        
    },
    backtoShippingInformation: function(component, event, helper){
        
        var orderRecord = component.get('v.orderupdate');
        //alert('sobject'+orderRecord);
        orderRecord.Id =  component.get('v.orderId');
        orderRecord.Order_Step__c =  'Contact Info' ; 
        
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
        
    }
    
})