({
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
    
    fetchPickListProdVal: function(component, fieldName, elementId) {
        var action = component.get("c.getsupplyProdOptions");
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
    getSupplyProducts1: function(component, event,elementId) {
        
        var action = component.get("c.getSupplyProducts1");
        action.setParams({
            
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
    
    getSupplyProducts: function(component, event,elementId,Category) {
        
        var action = component.get("c.getSupplyProducts");
        action.setParams({
            "Category": Category
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
     GetQuantityInstock: function(component, event, helper,product) {
         
         var orderitem = component.get("v.Order");
         
        var action = component.get("c.getQuantityInstockinfo");
        action.setParams({OrderId : orderitem.OrderId,
                          productName : product
                          });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state == "SUCCESS") {
                
                var Result = response.getReturnValue();
                component.set("v.OrderItemInstance.Quantity_In_Stock__c", 0);
                
                if(response.getReturnValue()!=null && response.getReturnValue()!='' && response.getReturnValue()!=undefined ){
                    
                    component.set("v.OrderItemInstance.Quantity_In_Stock__c", response.getReturnValue());
                }  
            }  
        });
        $A.enqueueAction(action);
     },
 getPreOrderItems : function(component, event, helper,product,Category) {
  
    var orderitem = component.get("v.Order");
         
    var action = component.get('c.getPresupplyItem');  
  
        action.setParams({supplyPreordID : orderitem.Previous_Order_ID__c 
                          
        });  
        
        action.setCallback(this, function(response) {  
            
            var state = response.getState();  
            if ( state === 'SUCCESS') {
                var previousorderitem = [];
                previousorderitem = response.getReturnValue();
                
                for(var i=0;i<previousorderitem.length;i++){
                  // alert('testprequa'+JSON.stringify(previousorderitem[i]));
                    if(previousorderitem[i].ProductCode__c == product && previousorderitem[i].Quantity!= undefined && previousorderitem[i].Quantity!= ''){
                     //  alert('testprequa'+previousorderitem[i].Quantity);  
                       //   component.set('v.OrderItemInstance.Previous_Quantity__c',previousorderitem[i].Quantity);
                      component.set("v.OrderItemInstance.Previous_Quantity__c", previousorderitem[i].Quantity);
                       // alert('testprequa');
                    }
                }
            }   
            
        });  
        $A.enqueueAction(action);  
     },
    getSupplyProductgroup: function(component, event,elementId,Productfamily) {
        
        var action = component.get("c.getSupplyProductgroup");
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