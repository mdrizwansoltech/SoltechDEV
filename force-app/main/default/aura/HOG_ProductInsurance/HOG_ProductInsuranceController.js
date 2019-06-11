({
    doInit: function(component, event, helper) {
          helper.fetchPickListInsuranceVal(component, event, helper);
       
     },
	  removeInsuranceRow : function(component, event, helper){
       component.getEvent("HOG_ProductInsuranceRecordRowEvent").setParams({"indexVar" : component.get("v.rowIndexVal") }).fire();
     },
     CreateOrderInsurance: function(component, event, helper) {
   
       var ProductInsuranceRec=component.get('v.ProductInsuranceRecord');
        
             if(component.find('InsuranceCoverage').get("v.value") != "--- None ---"){
                 var InsList=component.get('v.InsuranceList');
                 for(var i=0;i<InsList.length; i++){
                 ProductInsuranceRec.Order_Product__c =component.get('v.OrderItemRecordId');
                  if(InsList[i].Plan_Name__c ==component.find('InsuranceCoverage').get("v.value")){
                       component.find('InsuranceCoverage').set("v.value",InsList[i].Plan_Name__c);
                       ProductInsuranceRec.Insurance_Coverage__c=InsList[i].Id;
                 
                     }
                 }
                 
                var InsuranceCoverageRecordId=ProductInsuranceRec.Insurance_Coverage__c;
                 if(InsuranceCoverageRecordId != null && InsuranceCoverageRecordId!='' && InsuranceCoverageRecordId != undefined){
                 helper.fetchPickListPANumbers(component, event, helper,InsuranceCoverageRecordId);
                 }
             }  
                 if(component.find('PANumbers').get("v.value") != "--- None ---"){
                    
                 ProductInsuranceRec.PA_Number__c=component.find('PANumbers').get("v.value");
                 }
                 
                  component.set('v.ProductInsuranceRecord',ProductInsuranceRec);
             
             
      
       
         
     }
   
})