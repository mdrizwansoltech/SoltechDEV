({
    addOrderProdRecord: function(component, event) {
        
        var OrderProductList = component.get("v.OrderProductList");
        
        OrderProductList.push({
            'sobjectType': 'OrderItem',
            'Product2.Name': '',
            'Previous_Quantity__c': '',
            'Quantity_On_Hand__c': '',
            'Quantity_Needed__c': '',
            'UnitPrice': ''
        });
        component.set("v.OrderProductList", OrderProductList);
    },
    getSupplyProducts: function(component, event) {
        
        var action = component.get("c.getSupplyProducts");
        action.setCallback(this, function(response){
            var result =response.getReturnValue();
            // alert('Prodlst'+JSON.stringify(result));
            component.set("v.supplyprodlist",result);
            
        });
        $A.enqueueAction(action);
    },
    
    getActivePrescriptionProducts: function(component, event) {
        
        var action = component.get("c.getActPresPrdValues");
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
                component.set("v.selectedActProds", stringItems); 
                var OrderProductList = component.get("v.selectedActProds"); 
                
                component.set("v.OrderProductList", OrderProductList);
            }
        });
        $A.enqueueAction(action);
    },
    
    
    saveOrderprodList: function(component, event, helper) {
        //Call Apex class and pass account list parameters
        var tempIDs = [];
        // get(find) all checkboxes with aura:id "checkBox"
        var getAllId = component.find("prodName");
        //alert('1'+tempIDs); 
        for (var i = 0; i < getAllId.length; i++) {
            //   alert('2'+getAllId); 
            if (getAllId[i].get("v.value") == true) {
                tempIDs.push(getAllId[i].get("v.prdLst"));
            }
        }
        
        var ordProdList = component.get("v.OrderProductList");
        ordProdList.QuantyOnHands = component.find("QuantyOnhandsid").get("v.value");
        ordProdList.QuantyNeeded = component.find("QuantyNeededid").get("v.value");
        var selectedprod = component.find("prodName").get("v.value");
        
        
        var action = component.get("c.saveOrderprod");
        action.setParams({
            "ordProdList": ordProdList,
            selectedprod : selectedprod
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.OrderProductList", []);
                
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
                
            }
            
        }); 
        $A.enqueueAction(action);
    },
    getQuntyNeededPickListValues : function(component, event) {
        
        var action = component.get("c.getPickListValues");
        action.setParams({ obj:"OrderItem",str:"Quantity_Needed__c"});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
                
                component.set("v.options", stringItems); 
            }
        });
        $A.enqueueAction(action);
    },
    
    getquantyhandsPickListValues : function(component, event) {
        
        var action = component.get("c.getPickListValues");
        action.setParams({ obj:"OrderItem",str:"Quantity_On_Hand__c"});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
                //  alert(JSON.stringify(response.getReturnValue()))
                component.set("v.options1", stringItems); 
            }
        });
        $A.enqueueAction(action);
    },
    
    getcategoryPickListValues : function(component, event) {
        
        var action = component.get("c.getPickListValues");
        action.setParams({ obj:"Product2",str:"Category__c"});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
             //   alert(JSON.stringify(response.getReturnValue()));
                component.set("v.supplyoptions1", stringItems); 
                
            }
        });
        $A.enqueueAction(action);
    },
    
    getTempRecords : function(component, event,helper) {
        var action = component.get("c.getProdtemps");
        action.setCallback(this, function(response){
            var result =response.getReturnValue();
            //alert('Prodlst'+JSON.stringify(result));
            component.set("v.prodtemps",result);
            
        });
        $A.enqueueAction(action);
    }, 
    
    supplyaddOrderProdRecord: function(component, event) {
       // alert('InsidesupplyaddOrderProdRecord');
        var selectedCategory = component.find("Categoryid").get("v.value");
      //  alert('selectedCategory');
        var supplyOrderProductList = component.get("v.supplyOrderProductList");
        
        supplyOrderProductList.push({
            'sobjectType': 'OrderItem',
            'Product2.Category__c': '',
            'Product2.Name': '',
            'Previous_Quantity__c': '',
            'Quantity_Needed__c': '',
            'Quantity_In_Stock__c': '',
            'UnitPrice': ''
        });
        component.set("v.supplyOrderProductList", supplyOrderProductList);
    },
    
    saveOrderprodList: function(component, event, helper) {
        //Call Apex class and pass account list parameters
        var tempIDs = [];
        // get(find) all checkboxes with aura:id "checkBox"
        var getAllId = component.find("prodName");
        // alert('1'+tempIDs); 
        for (var i = 0; i < getAllId.length; i++) {
            //   alert('2'+getAllId); 
            if (getAllId[i].get("v.value") == true) {
                tempIDs.push(getAllId[i].get("v.prdLst"));
            }
        }
        
        var ordProdList = component.get("v.supplyOrderProductList");
        ordProdList.QuantyOnHands = component.find("QuantyOnhandsid").get("v.value");
        ordProdList.QuantyNeeded = component.find("QuantyNeededid").get("v.value");
        var selectedprod = component.find("prodName").get("v.value");
        
        
        var action = component.get("c.saveOrderprod");
        action.setParams({
            "ordProdList": ordProdList,
            selectedprod : selectedprod
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.supplyOrderProductList", []);
                
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
                
            }
            
        }); 
        $A.enqueueAction(action);
    },
    
    
})