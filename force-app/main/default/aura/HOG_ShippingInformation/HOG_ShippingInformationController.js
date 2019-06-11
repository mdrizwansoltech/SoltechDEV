({ 
    doInit: function(component, event, helper) {
       
           helper.getdefaultaddress(component, event);
         
      },
    Previous : function(component, event, helper) {
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:HOG_Selectclientcomponent",
            componentAttributes: {  
                recordId : component.get("v.orderId")
            }
        });
        evt.fire();
    },
    handleSubmit : function(component, event, helper) {
        
        var shipName = component.find("NameField").get("v.value");
        var streetfield = component.find("StreetFieldID").get("v.value");
        var cityfield = component.find("CityFieldID").get("v.value");
        var statefield = component.find("StateFieldID").get("v.value");
        var coutyfield = component.find("CoutyFieldID").get("v.value");
        var zipfield = component.find("ZipFieldID").get("v.value");
        
        var addtypefield = component.find("addreespurposeID").get("v.value");
        
        // perform validations as required based on the value retrieved
        if(shipName === "" || shipName === null ||  shipName === undefined ) {
            helper.showToast('error','Error Message','Street Name Should not be Blank'); 
            event.preventDefault(); // stop form submission
        }
        
        /*   if(streetfield === "" || streetfield === null ||  streetfield === undefined ) {
            helper.showToast('error','Error Message','Street Name Should not be Blank'); 
            event.preventDefault(); // stop form submission
        } */
        if(cityfield === "" || cityfield === null ||  cityfield === undefined ) {
            helper.showToast('error','Error Message','City Name Should not be Blank'); 
            event.preventDefault(); // stop form submission
        }
        if(statefield === "" || statefield === null ||  statefield === undefined ) {
            helper.showToast('error','Error Message','State Name Should not be Blank'); 
            event.preventDefault(); // stop form submission
        }
        if(coutyfield === "" || coutyfield === null ||  coutyfield === undefined ) {
            helper.showToast('error','Error Message','Counrty Name Should not be Blank'); 
            event.preventDefault(); // stop form submission
        }
        if(zipfield === "" || zipfield === null ||  zipfield === undefined ) {
            helper.showToast('error','Error Message','Zipcode Name Should not be Blank'); 
            event.preventDefault(); // stop form submission
        }
        
        if(addtypefield === "" || addtypefield === null ||  addtypefield === undefined ) {
            helper.showToast('error','Error Message','Address Pupose Name Should not be Blank'); 
            event.preventDefault(); // stop form submission
        }
        
        
        
    },
    
    
    openModel: function(component, event, helper) {
        
        
        
        var action = component.get('c.getAccountInfo1');
        
        action.setParams({  		
            orderId : component.get("v.orderId")  		
        });  		
        		
        action.setCallback(this, function(response) {  		
            var state = response.getState();  		
            if ( state === 'SUCCESS' && component.isValid() ) {  		
                component.set('v.accountId', response.getReturnValue().AccountId); 		
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
    closeModel1: function(component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle" 
        var params = event.getParams(); //get event params
        var fields = params.response.fields;
       // alert(fields);
        var recordId = params.response.id; //get record id
       // alert(recordId);
     component.set("v.shipCreatedRecordID", recordId);
        //  alert('Record is Created Successfully'); 
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Success Message',
            message: 'Record is created Successfully',
            messageTemplate: 'Record {0} created! See it {1}!',
            duration:' 5000',
            key: 'info_alt',
            type: 'success',
            mode: 'pester'
        });
        toastEvent.fire();
        
        
        helper.newaddress(component, event, helper);
        component.set("v.isOpen", false);
    },
    
     onaddressChange: function(component, event, helper) {
        component.set('v.Address', []);
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
                    
                    var Orderfor = component.get("v.Address");
                    var addid = Orderfor.Id ;
                    //alert('onchange address    '+addid);
                    component.set("v.shipCreatedRecordID", addid);
                    
                }else if (state === "ERROR"){
                    var errorMsg = action.getError()[0].message;
                    //alert(errorMsg);
                }      
                
            });  
            $A.enqueueAction(action);  
            
     
      },
    PassingtoShippingInformation : function(component, event, helper){
        helper.NextScreen(component, event, helper);
               
    },
    backtoselectcomp: function(component, event, helper){
        var orderRecord = component.get('v.Order');
            
         orderRecord.Id =  component.get('v.orderId');
         orderRecord.Order_Step__c =  'Select Client' ;  
          	
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
  })