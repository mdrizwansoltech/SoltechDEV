({
getPreOrderItems : function(component, event, helper) {

   var Order = component.get("v.Order");
  if(Order != undefined && Order != null && Order != ''){ 
    var preordID = Order.Previous_Order_ID__c;
  
    var action = component.get('c.getPreOrderItem');  
  
        action.setParams({  
            RxPreordID : preordID
            
        });  
        
        action.setCallback(this, function(response) {  
            
            var state = response.getState();  
            if ( state === 'SUCCESS' && component.isValid() ) {  
                //alert(JSON.stringify(response.getReturnValue()));
                component.set('v.preOrderItems', response.getReturnValue());   
              
            }   
            
        });  
        $A.enqueueAction(action);  
     }
    },
    
    getPreSupplyItems : function(component, event, helper) {
    	var previousOrder = component.get("v.Order");
        var preordID = previousOrder.Previous_Order_ID__c;
        var action = component.get('c.getPresupplyItem'); 
        
      
        action.setParams({  
            
            supplyPreordID : preordID
        });  
        
        action.setCallback(this, function(response) {  
            
            var state = response.getState();  
            if ( state === 'SUCCESS' && component.isValid() ) {  
                component.set('v.preOrderSupplyItems', response.getReturnValue());   
            }   
            
        });  
        $A.enqueueAction(action);  
    },
    
})