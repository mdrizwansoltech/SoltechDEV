({
	 doInit: function(component, event, helper) {
         //alert('hi');
         
       helper.fetchPickListProdVal(component, 'ProductCode', 'Products');
       helper.OrderDetails(component, event, helper);
       /*
       var rxnumberval=component.get('v.OrderItemInstance.RX_Number__c');
         //alert(rxnumberval);
         var allValues =[];
         var opts = [];
        
         if(rxnumberval!=null && rxnumberval!='' && rxnumberval !=undefined){
              allValues.push(rxnumberval);
           //  component.find('RxNumbers').set('v.value',rxnumberval);
 
          // component.set('v.OrderItemInstance.RX_Number__c',rxnumberval);
             // alert( component.find('RxNumbers').get("v.value"));
            // alert(component.get('v.OrderItemInstance.ProductCode__c'));
            // alert(component.get('v.OrderItemInstance.RX_Number__c'));
         }        
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
         */
             
    },
    SelectProduct: function(component, event, helper){
           var productCode=component.find('Products').get("v.value"); 
        if(productCode != "--- None ---" && productCode!=null && productCode!='' && productCode!=undefined)
            {
                helper.fetchPickListRXNumbers(component, event,productCode);
                        
            }
        
            
                 
       
    },
    AddNewRow : function(component, event, helper){
       // fire the AddNewRowEvt Lightning Event 
        component.getEvent("AddRowEvt").fire();     
    },
    removeRow : function(component, event, helper){
        
     // fire the DeleteRowEvt Lightning Event and pass the deleted Row Index to Event parameter/attribute
       component.getEvent("HOG_RXDeleteRowEvt").setParams({"indexVar" : component.get("v.rowIndex") }).fire();
    },
    
    AddInsurance: function(component, event, helper){
        var showSection=  component.get('v.ShowInsurance');
        if(showSection){
        component.set('v.ShowInsurance',false);
        }
        else{
             component.set('v.ShowInsurance',true);
        }
    },
    AddRowForInsurance: function(component, event, helper){
        
         
        var InsuranceRecordsList = component.get("v.InsuranceRecords");
        
        InsuranceRecordsList.push({
            'sobjectType': 'Product_Insurance__c',
           
            'PA_Number__c': '',
            'Product_Item__c': '',
            'Insurance_Coverage__c':''
        });
        component.set("v.InsuranceRecords", InsuranceRecordsList);
    },
    removeInsuranceRow : function(component, event, helper){
        
              // get the selected row Index for delete, from Lightning Event Attribute  
        var index = event.getParam("indexVar");
       // alert('parent index'+index);
        // get the all List (OrderItem attribute) and remove the Object Element Using splice method    
        var AllRowsList = component.get("v.InsuranceRecords");
        AllRowsList.splice(index, 1);
        // set the OrderItemList after remove selected row element  
        component.set("v.InsuranceRecords", AllRowsList);
        
    },
     saveOrderprodList: function(component, event, helper) {
         
     
         var insuranceRecords;
         insuranceRecords=component.get('v.InsuranceRecords');
         // alert('@@@@Save Insurance call loftd'+insuranceRecords);
       
         if(insuranceRecords!=null && insuranceRecords!='' && insuranceRecords!=undefined && insuranceRecords.length>0){
            
         
         var action = component.get("c.SaveOrderItemInsurance");
        
         action.setParams({
           // "insuranceRecordsjsonString" : JSON.stringify(insuranceRecords)
            "ProductInsuranceInsertList" : insuranceRecords
        });  
         
         
         
           action.setCallback(this, $A.getCallback(function (response) {
                
              
                var state = response.getState();
          
                if (state === "SUCCESS") {
                    
                    var untitleProject = response.getReturnValue();
                   var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Success Message',
                    message: 'Insurance added to your order item Successfully',
                    messageTemplate: 'Record {0} created! See it {1}!',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'pester'
                });
                 toastEvent.fire();
                
    
         } 
                
                else {
                    var toastEvent = $A.get("e.force:showToast");
                    var message = '';
                    if (state === "INCOMPLETE") {
                        message = 'Server could not be reached. Check your internet connection.';
                    } else if (state === "ERROR") {
                        var errors = response.getError();
                        if (errors) {
                            for(var i=0; i < errors.length; i++) {
                                for(var j=0; errors[i].pageErrors && j < errors[i].pageErrors.length; j++) {
                                    message += (message.length > 0 ? '\n' : '') + errors[i].pageErrors[j].message;
                                }
                                if(errors[i].fieldErrors) {
                                    for(var fieldError in errors[i].fieldErrors) {
                                        var thisFieldError = errors[i].fieldErrors[fieldError];
                                        for(var j=0; j < thisFieldError.length; j++) {
                                            message += (message.length > 0 ? '\n' : '') + thisFieldError[j].message;
                                        }
                                    }
                                }
                                if(errors[i].message) {
                                    message += (message.length > 0 ? '\n' : '') + errors[i].message;
                                }
                            }
                        } else {
                            message += (message.length > 0 ? '\n' : '') + 'Unknown error';
                        }
                    }
                    toastEvent.setParams({
                        title: 'Error',
                        type: 'error',
                        message: message
                    });
                    toastEvent.fire();
                }//Error code ends 
                
            }));
            $A.enqueueAction(action);
        
         }
   
      },
    handleOrderStatusEvent:function(component, event, helper) {
       
      var status= event.getParam("OrderStatus");
       
     helper.OrderDetails(component, event, helper);
    
   }
})