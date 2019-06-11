({
	GetCurrentStage: function(component, event) { 

       var OrderRecordId=component.get('v.recordId');
       if(OrderRecordId!=null && OrderRecordId!='' && OrderRecordId!=undefined)
       {
       //Fetch existing order record
        var action = component.get("c.getOrderDetails");
          // alert(component.get('v.recordId'));
        action.setParams({
            RecordId :component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if (component.isValid() && state === "SUCCESS") {
          
                var Result = response.getReturnValue();
                
                component.set("v.order",response.getReturnValue());
               
          
                if (Result.Order_Step__c !=null && Result.Order_Step__c !='' && Result.Order_Step__c !=undefined){           
                 
                    component.set("v.currentOrderstep",Result.Order_Step__c);
                    
                }
                else { 
                    component.set("v.currentOrderstep","Select Client");
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
  
          component.set("v.currentOrderstep","Select Client");
         }
       
        
    }
})