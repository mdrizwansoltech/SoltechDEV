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
    GetClientName:function(component, event, helper){
        
        var orderRecId= component.get('v.orderId');
        if(orderRecId!=null && orderRecId!='' && orderRecId!=undefined){
            var action = component.get("c.getOrderDetails");
            action.setParams({RecordId : orderRecId});
            action.setCallback(this, function(response) {
                var state = response.getState();
                if(state == "SUCCESS") {
                    var CName;
                    var ClientName= [];
                    var Result = response.getReturnValue();
                    if(response.getReturnValue()!=null && response.getReturnValue()!='' && response.getReturnValue()!=undefined ){
                        CName=Result.Client_Chart__r.Name;
                        component.set("v.selectedClientId",Result.Client_Chart__c);
                        ClientName=CName.split("(");
                    }
                    if(ClientName!=null && ClientName!='' && ClientName!=undefined){
                        component.set("v.ClientName",ClientName[0]); 
                    }
                }
                
            });
            $A.enqueueAction(action);
        }
    },
    SetOrderRecord: function(component, event, helper){
        
        
        var orderRecId =component.get("v.orderId");
        
        if(orderRecId!=null && orderRecId!='' && orderRecId!=undefined){
            component.set('v.orderId',orderRecId);
            helper.GetClientName(component, event,helper);
            
            var action = component.get("c.getInsuranceInfo");
            action.setParams({OrderId : orderRecId});
            action.setCallback(this, function(response) {
                var state = response.getState();
                
                if(state == "SUCCESS") {
                   
                    var Result = response.getReturnValue();
                     
                        component.set("v.ListOfRecords", response.getReturnValue());
                        // alert(component.get("v.ListOfRecords").length);
                   
                    
                }
                
            });
            $A.enqueueAction(action);
            
        }
    },
    //Helper method to display the error toast message
    showToast : function(type,title,message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : title,
            message: message,
            key: 'info_alt',
            type: 'error',
            mode: 'pester',
            duration: '2000',
        });
        toastEvent.fire(); 
    } ,validateRequired: function(component, event) {
        var isValid = true;
        var allinsuRows = component.get('v.ListOfRecords');
        
        if(allinsuRows.length <= 0){
            isValid = false;}
        return isValid;
    },
})