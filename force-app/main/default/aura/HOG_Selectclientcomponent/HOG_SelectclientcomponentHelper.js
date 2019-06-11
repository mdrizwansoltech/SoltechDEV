({
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
                    var record = component.get("v.createorder");
                      
                    var SendOrderInformationEvent = component.getEvent('ordercreated');
                    SendOrderInformationEvent.setParams({
                        "createdorder"    :    record 
                    }); 
                    SendOrderInformationEvent.fire();
                    
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
       
        
    }
})