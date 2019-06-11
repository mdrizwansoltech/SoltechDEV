({
	fetchPickListProdVal: function(component, fieldName, elementId) {
        
        var action = component.get("c.getRXProdOptions");
        action.setParams({
            "objObject": component.get("v.objInfo"),
            "fld": fieldName
        });
        var opts = [];
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
 
                if (allValues != undefined && allValues.length > 0) {
                    opts.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }
                for (var i = 0; i < allValues.length; i++) {
                    opts.push({
                        class: "optionClass",
                        label: allValues[i],
                        value: allValues[i]
                    });
                }
                component.find(elementId).set("v.options", opts);
            }
        });
        $A.enqueueAction(action);
    },
    fetchPickListVal: function(component, fieldName, elementId) {
        var action = component.get("c.getselectOptions");
        action.setParams({
            "objObject": component.get("v.objInfo"),
            "fld": fieldName
        });
        var opts = [];
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
                
                if (allValues != undefined && allValues.length > 0) {
                    opts.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }
                for (var i = 0; i < allValues.length; i++) {
                    opts.push({
                        class: "optionClass",
                        label: allValues[i],
                        value: allValues[i]
                    });
                }
                component.find(elementId).set("v.options", opts);
            }
        });
        $A.enqueueAction(action);
    },
    getRXPreOrderItems : function(component, event, helper,product,Category) {
  
    var orderitem = component.get("v.Order");
       
    var action = component.get('c.getPreOrderItem');  
         action.setParams({
            RxPreordID : orderitem.Previous_Order_ID__c 
         });
        action.setCallback(this, function(response) {  
            
            var state = response.getState();  
            if ( state === 'SUCCESS') {
                var previousorderitem = [];
                previousorderitem = response.getReturnValue();
                // alert(JSON.stringify(previousorderitem));
                for(var i=0;i<previousorderitem.length;i++){
                  // alert(previousorderitem[i].ProductCode__c);
                    if(previousorderitem[i].ProductCode__c == product ){
                        
                          component.set("v.OrderItemInstance.Previous_Quantity__c",previousorderitem[i].Quantity);
                    }
                }
            }   
            
        });  
        $A.enqueueAction(action);  
     },
    
     getPriorAuthorizationMethod : function(component, event,elementId,product) {
        
        var action = component.get("c.getPriorAuth");
      
    var clientIDval = component.get("v.Order");
    
        action.setParams({
            
            "selProduct": product,
            ClientId  : clientIDval.Client_Chart__c
        });
         var opts = [];
         action.setCallback(this, function(response) {
            
            if (response.getState() == "SUCCESS") {
                 var allValues = [];
                var allValues = response.getReturnValue();
           
                if (allValues != undefined && allValues.length > 0) {
                    for(var i=0;i<allValues.length;i++){
                 var authName = allValues[i].Name;
                 
                  var authEndDate = allValues[i].Ending_Date__c;
                        //alert(authEndDate);
                       var dateValue = $A.localizationService.formatDate(authEndDate, 'YYYY-MM-DD');
                      var  priorAuth =(authName) +"--" +dateValue ;
                      
               component.set("v.OrderItemInstance.Prior_Authorization1__c", priorAuth);
                    }
                }}
        });
        $A.enqueueAction(action);
        
        
    },
    
    getRXProducts: function(component, event,elementId,Productfamily) {
        
        var action = component.get("c.getRXProducts");
        action.setParams({
            "Productfamily": Productfamily
        });
        var opts = [];
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
                
                if (allValues != undefined && allValues.length > 0) {
                    opts.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }
                for (var i = 0; i < allValues.length; i++) {
                    opts.push({
                        class: "optionClass",
                        label: allValues[i],
                        value: allValues[i]
                    });
                }
               // alert(JSON.stringify(opts));
                component.find(elementId).set("v.options", opts);
            }
        });
        $A.enqueueAction(action);
    },
    getFactorRXProducts: function(component, event,elementId,Productfamily) {
        
        var action = component.get("c.getFactorRXProducts");
        action.setParams({
            "Productfamily": Productfamily
        });
        var opts = [];
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
                
                if (allValues != undefined && allValues.length > 0) {
                    opts.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }
                for (var i = 0; i < allValues.length; i++) {
                    opts.push({
                        class: "optionClass",
                        label: allValues[i],
                        value: allValues[i]
                    });
                }
               // alert(JSON.stringify(opts));
                component.find(elementId).set("v.options", opts);
            }
        });
        $A.enqueueAction(action);
    },

    
    
})