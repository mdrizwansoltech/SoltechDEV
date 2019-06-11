({
    
    isFormValid: function (component) {
        return (component.find('shipNamevalidation') || [])
        .filter(function (i) {
            var value = i.get('v.value');
            return !value || value == '' || value.trim().length === 0;
        })
        .map(function (i) {
            return i.get('v.fieldName');
        });
    },
    //Helper method to display the error toast message
    showToast : function(type,title,message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : title,
            message: message,
            duration:'10000',
            key: 'info_alt',
            type: type,
            mode: 'dismissible'
        });
        toastEvent.fire(); 
    } ,
    getdefaultaddress: function(component, event ) {
       
        var action = component.get('c.defaultaddress');  
        action.setParams({  
            
            orderId : component.get("v.orderId")  
            
        });  
        
        action.setCallback(this, function(response) {  
            
            var state = response.getState(); 
           
            if ( state === 'SUCCESS' && component.isValid() ) {  
                
                component.set('v.Address', response.getReturnValue()); 
                               
               var addid = component.get("v.Address").Id;
               
                 component.set("v.shipCreatedRecordID", addid);
                 
            }   
            
        });  
        $A.enqueueAction(action);  
    },NextScreen : function(component, event, helper) {
        var phoneFld = component.find("Phone").get("v.value");
        var placedByFld = component.find("PlacedBy").get("v.value");
        var shipName = component.find("ShipToName").get("v.value");
        var shipAdd = component.find("shipAddid").get("v.value");
        var signtre = component.find("Signaturerequired").get("v.value");
        if( phoneFld == '' || phoneFld == '' || phoneFld == null ){
            // component.find("Phone").set("v.errors", [{message:"Please Enter Phone before Proceeding"}]);
            helper.showToast('error','Error Message','Please Enter Phone before Proceeding'); 
         
        }
     /*   if(placedByFld == undefined || placedByFld == '' || placedByFld == null || !isEmpty(placedByFld)){
            // component.find("PlacedBy").set("v.errors", [{message:"Please Enter Placed By before Proceeding"}]);
            helper.showToast('error','Error Message','Please Enter Placed By before Proceeding'); 
        } */
        if(shipName == undefined || shipName == '' || shipName == null){
            helper.showToast('error','Error Message','Please Enter Ship to Name before Proceeding');    
        }
        if(shipAdd == undefined || shipAdd == '' || shipAdd == null){
            helper.showToast('error','Error Message','Please Enter Ship Address before Proceeding');
        } 
      /*  if(signtre == undefined || signtre == '' || signtre == null){
            helper.showToast('error','Error Message','Please Enter Signature before Proceeding');    
        }*/
        
        
        else{
            var orderRecord = component.get('v.Order');
            
         orderRecord.Phone__c = component.find("Phone").get("v.value");
         orderRecord.Placed_By__c = component.find("PlacedBy").get("v.value");
         orderRecord.Ship_To_Name__c = component.find("ShipToName").get("v.value");
         orderRecord.Shipping_Address__c = String(component.find("shipAddid").get("v.value"));
         orderRecord.Signature__c = String(component.find("Signaturerequired").get("v.value"));
         orderRecord.Id =  component.get('v.orderId');
         orderRecord.Order_Step__c =  'Update Insurance' ;  
          	var orderId = component.get('v.orderId');
            var OrderAccName = component.get('v.clientName.AccountId');  
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
                    
                      var JSONStr = JSON.stringify(untitleProject); 
                   // alert('updated order'+JSONStr);
                    
                    var GetOrderStep = component.getEvent('HOG_GetOrderStep');
                    GetOrderStep.setParams({
                        "nextstep"    :    "1" 
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
    },
    newaddress: function(component, event, helper) {
        
        var addresssid = component.find("shipAddid").get("v.value");
        
        
        var addid = addresssid.toString();
        var action = component.get('c.getaddress');  
        action.setParams({  
            
            addressId : addid
            
        });  
        action.setCallback(this, function(response) {  
            
            var state = response.getState();  	
            if ( state === 'SUCCESS' && component.isValid() ) { 
                
                component.set('v.Address', response.getReturnValue()); 
                
            }else if (state === "ERROR"){
                var errorMsg = action.getError()[0].message;
                //alert(errorMsg);
            }      
            
        });  
        $A.enqueueAction(action);  
        
        
    }    
    
    
    
})