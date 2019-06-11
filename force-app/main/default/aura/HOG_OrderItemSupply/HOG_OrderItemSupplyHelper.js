({
    addOrderProdRecord: function(component, event) {
        
        //get the account List from component  
        var OrderProductList = component.get("v.OrderProductList");
        //Add New Account Record
        OrderProductList.push({
            'sobjectType': 'OrderItem',
            'Category__c': '',
            'Product2.Name': '',
            'Previous_Quantity__c': '',
            'Quantity_Needed__c': '',
            'Quantity_In_Stock__c': '',
            'UnitPrice': ''
        });
        component.set("v.OrderProductList", OrderProductList);
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
        action.setParams({ obj:"OrderItem",str:"Category__c"});
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
    getTempRecords : function(component, event,helper) {
        var action = component.get("c.getProdtemps");
        action.setCallback(this, function(response){
            var result =response.getReturnValue();
            //alert('Prodlst'+JSON.stringify(result));
            component.set("v.prodtemps",result);
            
        });
        $A.enqueueAction(action);
    },  
    
})