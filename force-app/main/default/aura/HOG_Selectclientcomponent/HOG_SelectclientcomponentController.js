/*******************************************************************************************************************************
* Copyright(C)2019
* Soltech
* All Rights Reserved
* Name      : HOG_SelectclientcomponentController.js
* Purpose   : This component is used  to show the list of clients in the lookup field and save to order   

**********************************************************************************************************************************
*   Version No                   Name                           Date                                Description

* ================================================================================================================================
*        1.0                   Rizwan Mohammed                     04/05/2019                        Initial Version
				   
*********************************************************************************************************************************** */


({
    doInit : function(component, event, helper){
        if(component.get("v.order.Id")!= null)
            
        component.set("v.recordId",component.get("v.order.Id"));
    
        if(component.get("v.recordId") != '' && component.get("v.recordId") != null && component.get("v.recordId") != undefined)
        {
        //Fetch existing order record
        var action = component.get("c.getOrderDetails");
        action.setParams({"RecordId" :component.get("v.recordId")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var Result = response.getReturnValue();
                var ClientId ;
                if (Result.Client_Chart__c != null && Result.Client_Chart__c != ''&& Result.Client_Chart__c != undefined){
                    // Set the clientId into client chat lookup	
                    component.find("Client").set("v.value",Result.Client_Chart__c);
                    component.set("v.selectedClientId",Result.Client_Chart__c);
                    
                } 
                else{
                    component.find("Client").set("v.value",'');
                }
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
        
        //verify selected clientId is blank or notequal to null  
        var recordId = component.get("v.selectedClientId");
        if(recordId != '' && recordId != undefined && recordId != null){
            // Set the clientId into client chat lookup	
            component.find("Client").set("v.value",recordId);
        }else{
            
            component.find("Client").set("v.value",'');
        }
        }  
    },
    selectedClient: function(component, event, helper) {
        var clientChartId = component.find("Client").get("v.value");
        //Set the selected clientId into selectedClientId Attribute
        component.set("v.selectedClientId",clientChartId); 
        
    },
    
StartOrder: function(component, event, helper) {
        
        var clientChartId = component.find("Client").get("v.value");
        
        if (clientChartId != null && clientChartId != ''&& clientChartId !=undefined){
            //Save the order with selectedClientId 
            
            var action = component.get("c.saveClientToOrder");
            var recordId = component.get("v.recordId");
            
            action.setParams({"ClientId" : clientChartId,
                              "orderId"  : recordId
                              });
            action.setCallback(this, function(response) {
                var state = response.getState();
                
                if (component.isValid() && state === "SUCCESS") {
                    var Result = response.getReturnValue();
                    
                    var orderId ;
                    if (Result.Id != null && Result.Id != '' && Result.Id != undefined){
                        
                        orderId = Result.Id; 
                        component.set("v.createorder",Result);
                        
                        
                   } 
                    
                    
                    
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
        } 
        else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
             
                key: 'info_alt',
                type: 'error',
                mode: 'pester',
                duration: '2000',
                message: 'Please Select Client Chart',
                 
            });
            toastEvent.fire();
            
        }
       
        
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
                var ClientId ;
             
                if (Result.Client_Chart__c != null && Result.Client_Chart__c != ''&& Result.Client_Chart__c != undefined){
                    // Set the clientId into client chat lookup	
                    component.find("Client").set("v.value",Result.Client_Chart__c);
                    component.set("v.selectedClientId",Result.Client_Chart__c);
                } 
                else{
                    component.find("Client").set("v.value",'');
                }
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
    getMessage : function(component, event, helper) {
        helper.StartOrder(component, event, helper);
    }
    
})