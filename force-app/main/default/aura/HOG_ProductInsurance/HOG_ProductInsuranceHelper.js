({
	 fetchPickListInsuranceVal: function(component,event, helper) {
         
        var action = component.get("c.getInsuranceOptions");
           action.setParams({ orderId : component.get('v.orderId') });
        var opts = [];
        action.setCallback(this, function(response) {
             var allValues =[];
            if (response.getState() == "SUCCESS") {
               
                 var Insurancelist= response.getReturnValue();
               
                component.set('v.InsuranceList',Insurancelist);
                for (var i=0;i<Insurancelist.length; i++){        
                 allValues.push(Insurancelist[i].Plan_Name__c); 
                    
                 }    
                
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
                component.find('InsuranceCoverage').set("v.options", opts);
            }
        });
        $A.enqueueAction(action);
    },
   fetchPickListPANumbers: function(component,event, helper,InsuranceCoverageRecordId) {
         
        var action = component.get("c.getPANumberOptions");
           action.setParams({ InsuranceId : InsuranceCoverageRecordId });
        var opts = [];
        action.setCallback(this, function(response) {
             var allValues =[];
            if (response.getState() == "SUCCESS") {
               
                 var PANumberLists= response.getReturnValue();
               
               component.set('v.PANumberList',PANumberLists);
                for (var i=0;i<PANumberLists.length; i++){        
                 allValues.push(PANumberLists[i].PA_Number__c); 
                    
                 }    
                
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
                component.find('PANumbers').set("v.options", opts);
            }
        });
        $A.enqueueAction(action);
    },
})