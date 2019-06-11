({
    OrderDetails: function(component,event,helper) {
        //alert(component.get("v.orderId"));
        var action = component.get("c.getOrderDetails");
        action.setParams({
            "RecordId": component.get("v.orderId"),
            
        });
       
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var OrderDetails = response.getReturnValue();
                component.set('v.OrderInstance',OrderDetails);
                  // alert('@@@sc'+OrderDetails.Status);
                //alert(component.get('v.OrderInstance').Status);
            }
        });
        $A.enqueueAction(action);
    },
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
        var InsuranceVerify=component.get('v.statusValue');        
           if(InsuranceVerify){
         var productCode=component.find('Products').get("v.value"); 
        if(productCode != "--- None ---" && productCode!=null && productCode!='' && productCode!=undefined)
            {
                this.fetchPickListRXNumbers(component, event,productCode);
                        
            }
        }           
    },
   fetchPickListRXNumbers: function(component,event,productCode) {
         var opts = [];
        var action = component.get("c.getRXNumberOptions");
      
       action.setParams({"RecordId": component.get("v.orderId"),"ProductCode":productCode});
        
        action.setCallback(this, function(response) {
             var allValues =[];
         
            if (response.getState() === "SUCCESS") {
                
              var  RXNumberLists= response.getReturnValue();
            // alert(RXNumberLists);
                //  component.set('v.RXNumberList',RXNumberLists);
                       if (RXNumberLists != undefined && RXNumberLists.length > 0) {      
                for (var i=0;i<RXNumberLists.length; i++){ 
                    if(RXNumberLists[i].RX_Number__c!=null && RXNumberLists[i].RX_Number__c!='' && RXNumberLists[i].RX_Number__c!=undefined)
                    {    allValues.push(RXNumberLists[i].RX_Number__c); 
                 
                     component.find('RxNumbers').set("v.value", RXNumberLists[i].RX_Number__c);
                      
                    }
                 }    
                       }
                     /*          if (allValues != undefined && allValues.length > 0) {
                    opts.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }*/
             
                for (var i = 0; i < allValues.length; i++) {
                    opts.push({
                        class: "optionClass",
                        label: allValues[i],
                        value: allValues[i]
                    });
                }
               
               if (opts != undefined && opts.length > 0) {
               component.find('RxNumbers').set("v.options", opts);
                   
               }
               
            }              
        });
        $A.enqueueAction(action);
    },
    
      
    
})