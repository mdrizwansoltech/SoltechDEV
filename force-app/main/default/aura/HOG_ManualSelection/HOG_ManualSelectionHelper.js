({
	 getorderDetails: function(component, event) {
         
         
          var action = component.get("c.getOrderDetails");
        action.setParams({
           RecordId :component.get('v.OrderId')
                     });
        action.setCallback(this, function(response){
            var state = response.getState();
            var opts = [];
               if (state === "SUCCESS") {
                           var result =response.getReturnValue();    
                   component.set('v.Order',result);
                }
                   
        });
        $A.enqueueAction(action);
     },
})