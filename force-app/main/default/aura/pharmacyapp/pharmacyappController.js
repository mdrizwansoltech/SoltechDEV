({
	doInit : function(component, event, helper) {
      
        
		var action = component.get("c.getPickListValuesIntoList");
            action.setCallback(this, function(response) {
            var state = response.getState();
                if (component.isValid() && state === "SUCCESS") {
                var Result = response.getReturnValue();
                component.set('v.steps',response.getReturnValue());
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
       helper.GetCurrentStage (component, event); 
        
	},
    
    ordercreated: function(component, event, helper) {
      
        var message = event.getParam("createdorder");    
        component.set('v.recordId',message.Id);
        component.set('v.order',message);   
        
        helper.GetCurrentStage (component, event);
    },
    HOG_GetOrderStep: function(component, event, helper) {
      
        helper.GetCurrentStage (component, event);
    },
    next: function(component, event, helper) {
       
        var childCmp = component.find("selectcomp");
        var retnMsg = childCmp.Passingtoselectcomp();
        //component.set('v.currentOrderstep',"Contact info");
         
    },
    
    next1: function(component, event, helper) {
        
        var childCmp = component.find("ShippingInformation");
        var retnMsg = childCmp.PassingtoShippingInformation();
        
    },
    back1 : function(component, event, helper) {
        
        var childCmp = component.find("ShippingInformation");
        var retnMsg = childCmp.backtoselectcomp();
        
    },
    next2: function(component, event, helper) {
        
        var childCmp = component.find("UpdateInsurance");
        var retnMsg = childCmp.Passingtoaddorderitems();
        
    },
    back2 : function(component, event, helper) {
        
        var childCmp = component.find("UpdateInsurance");
        var retnMsg = childCmp.backtoShippingInformation();
        
    },
    next3: function(component, event, helper) {
        
        var childCmp = component.find("AddOrderItems");
        var retnMsg = childCmp.PassingtoOrderInstructions();
        
    },
    back3 : function(component, event, helper) {
        
        var childCmp = component.find("AddOrderItems");
        var retnMsg = childCmp.backtoUpdateInsurance();
        
    },
    next4: function(component, event, helper) {
        
        var childCmp = component.find("OrderInstructions");
        var retnMsg = childCmp.PassingtoOrderReview();
        
    },
    back4 : function(component, event, helper) {
        
        var childCmp = component.find("OrderInstructions");
        var retnMsg = childCmp.backtoAddOrderItems();
        
    },
    next5: function(component, event, helper) {
        
        var childCmp = component.find("OrderReview");
        var retnMsg = childCmp.PassingtoPharmacyWorking();
        
    },
    back5 : function(component, event, helper) {
        
        var childCmp = component.find("OrderReview");
        var retnMsg = childCmp.backtoOrderInstructions();
        
    },
    next6: function(component, event, helper) {
        
        var childCmp = component.find("PharmacyWorking");
        var retnMsg = childCmp.PassingtoOrderReview();
        
    },
    back6 : function(component, event, helper) {
        
        var childCmp = component.find("PharmacyWorking");
        var retnMsg = childCmp.backtoOrderReview();
        
    }
})