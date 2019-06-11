({
   
    
     getorderDetails: function(component, event) {
         
         
          var action = component.get("c.getOrderDetails");
        action.setParams({
           RecordId :component.get('v.recordId')
                     });
        action.setCallback(this, function(response){
            var state = response.getState();
            var opts = [];
               if (state === "SUCCESS") {
                           var result =response.getReturnValue();    
                   component.set('v.Order',result);
                }
                   if(result.Status=='Insurance Verify')
                  {
                      component.set("v.OrderSave",true);
                }    
            
        });
        $A.enqueueAction(action);
     },
     
  getorderStatus: function(component, event) {
 var action = component.get("c.getPickListValues");
        action.setParams({
                    obj : 'Order',
                    str:'Status'
                     });
        action.setCallback(this, function(response){
            var state = response.getState();
            var opts = [];
             var orderStatusValue=component.get('v.Order');
               if (state === "SUCCESS") {
                   var allValues =[];
                    var OrderStatus = response.getReturnValue();
                // alert('OrderStatus@@@@@@'+OrderStatus);
               
                for (var i=0;i<OrderStatus.length; i++){  
                    if(orderStatusValue.Status=='Order Verify' && OrderStatus[i]!='Activated' && OrderStatus[i]!='Released') {                  
                 allValues.push(OrderStatus[i]); 
                    } 
                   
                    if(orderStatusValue.Status=='Insurance Verify' && OrderStatus[i]!='Order Verify' && OrderStatus[i]!='Activated' ) {                  
                 allValues.push(OrderStatus[i]); 
                    }
                    
                 }  
                 //alert('OrderStatus@@@@@@2'+allValues);
                   
              /*  if (allValues != undefined && allValues.length > 0) {
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
                component.find('StatusValues').set("v.options", opts); 
                                
                }
              component.find('StatusValues').set("v.value",orderStatusValue.Status);  
            var statuschange = component.find("StatusValues").get("v.value");
          
             if(statuschange == 'Insurance Verify' )
          {
              component.set("v.statusValue",true);
               component.set("v.InsurancestatusValue",false);
          }else{
              component.set("v.statusValue",false);
               component.set("v.InsurancestatusValue",true);
          }
            
        });
        $A.enqueueAction(action);
		},
    getorderitems: function(component, event) {
      
       // var action = component.get("c.getexistingproducts");
        
        var action = component.get("c.getOrderproducts");
        var OrderId = component.get('v.recordId');
          
        action.setParams({
                    OrderId  : OrderId,
                     });
        action.setCallback(this, function(response){
            var rxlist =[];
            var supply =[];
            var result =response.getReturnValue();
           // alert('@@333333333333'+result.length);
         //  component.set('v.OrderWrapProductList',result);
            if(result.length!=null && result.length!='' && result.length!=undefined && result.length>0){
            for(var i=0;i<result.length;i++){
               // alert('@@@1'+result[i].OrderProduct.Product_Type__c);
                if(result[i].OrderProduct.Product_Type__c == 'Rx'  || result[i].OrderProduct.Product_Type__c == 'Factor'){
                  // alert('@@@@2'+result[i].OrderProduct.Product_Type__c);
                    rxlist.push(result[i].OrderProduct);
                     
                
                   
                }
               
                
                if(result[i].OrderProduct.Product_Type__c == 'Supply'){
                    supply.push(result[i].OrderProduct);
                     // alert('@@3'+result[i].OrderProduct.Product_Type__c);               
                }
               
               }
           
           // alert('@@4'+rxlist.length);
            
            if(rxlist.length!=null && rxlist.length !='' && rxlist.length !=undefined && rxlist.length > 0){
            component.set("v.RXOrderItemList",rxlist);
            }
             else{
                    component.set("v.RXOrderItemList",[]);
                }
           // alert('@@5');
           // component.set("v.OrderWrapProductList",rxlist);
           
            if(supply.length !=undefined && supply.length != '' && supply.length !=null && supply.length > 0){
            component.set("v.SupplyOrderItemList",supply);
            }
             else{
                    component.set("v.SupplyOrderItemList",[]);
                    
                }
            
            }    
        });
        $A.enqueueAction(action);
        
    },
	getOrdInsuranceRecords : function(component, event) {
        //alert('Hello'+component.get('v.recordId'));
          var action = component.get("c.getInsuranceInfo");
        action.setParams({OrderId : component.get('v.recordId')});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state == "SUCCESS") {
                var Result = response.getReturnValue();
                if(response.getReturnValue()!=null && response.getReturnValue()!='' && response.getReturnValue()!=undefined && response.getReturnValue().length>0){
                    component.set("v.ListOfRecords", response.getReturnValue());
                }  
            }  
        });
        $A.enqueueAction(action);
        
      },
    createRXObjectData: function(component, event) {
        // get the contactList from component and add(push) New Object to List  
        var OrderProductList = component.get("v.RXOrderItemList");
        
        OrderProductList.push({
            'sobjectType': 'OrderItem',
            'Product2.Name': '',
            'Dosage__c':'',
            'Previous_Quantity__c': '',
            'Quantity_On_Hand__c': '',
            'Quantity_Needed__c': '',
            
            'Rx_Number__c': '',
            'PANumber__c': '',
            'Insurance__c': '',
        });
        component.set("v.RXOrderItemList", OrderProductList);
        
    },
    
     createsupplyObjectData: function(component, event) {
        // get the contactList from component and add(push) New Object to List  
        var RowItemList = component.get("v.SupplyOrderItemList");
        RowItemList.push({
            'sobjectType': 'OrderItem',
            'Category__c': '',
            'ProductCode__c': '',
            'Previous_Quantity__c': '',
            'Quantity_Needed__c':'',
            'Quantity_In_Stock__c':''
            
        });
        // set the updated list to attribute (contactList) again    
        component.set("v.SupplyOrderItemList", RowItemList);
        
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
        
        var supplyOrderProductList = component.get("v.supplyOrderProductList");
       
        supplyOrderProductList.push({
            'sobjectType': 'OrderItem',
            'Category__c': '',
            'Product2.Name': '',
            'Previous_Quantity__c': '',
            'Quantity_Needed__c': '',
            'Quantity_In_Stock__c': '',
            'UnitPrice': ''
        });
        component.set("v.supplyOrderProductList", supplyOrderProductList);
    },
    createRXObjectData: function(component, event) {
        
        // get the contactList from component and add(push) New Object to List  
        var OrderProductList = component.get("v.RXOrderItemList");
        
        OrderProductList.push({
            'sobjectType': 'OrderItem',
            'ProductCode__c': '',
            'Previous_Quantity__c': '',
            'Quantity_On_Hand__c': '',
            'Quantity_Needed__c': '',
            'UnitPrice': ''
        });
        component.set("v.RXOrderItemList", OrderProductList);
        
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
   
    
      upsertOrderprodList: function(component, event) {
      //  alert('calling');
        var action = component.get("c.priceBookEntryObj");
         var ProdIds =[];
        var RXOrderItemList =[];
        var SupplyOrderItemList = [];
        
        RXOrderItemList = component.get("v.RXOrderItemList");
        SupplyOrderItemList =  component.get("v.SupplyOrderItemList");
     
        for(var i=0;i<RXOrderItemList.length;i++){
            ProdIds.push(RXOrderItemList[i].ProductCode__c);
          
           }
        for(var i=0;i<SupplyOrderItemList.length;i++){
            ProdIds.push(SupplyOrderItemList[i].ProductCode__c);
         
           }
        
        var OrderId = component.get('v.OrderId');
        var recordId = component.get("v.recordId");
        
        action.setParams({
            rxProductID   : ProdIds,
            orderid  : OrderId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
             
                component.set("v.pricebookEntryvalue", stringItems); 
                
                //Save Order COde Starts Here
                
                var recordId = component.get("v.recordId");
                var prBookID = component.get("v.pricebookEntryvalue"); 
               
                var selectedprods = [];
                for(var i=0;i<prBookID.length;i++){
                    selectedprods.push(prBookID[i].Id); 
                   
                }
                var action2 = component.get("c.saveOrderprod");
                RXOrderItemList = component.get("v.RXOrderItemList");
            
                SupplyOrderItemList =  component.get("v.SupplyOrderItemList");
                action2.setParams({
                    orderid  : recordId,
                    prBookID : selectedprods,
                    RXOrderItemList : RXOrderItemList,
                    SupplyOrderItemList : SupplyOrderItemList
                });
                
                action2.setCallback(this, function(response) {	
                    var state = response.getState();
                    
                    if (state === "SUCCESS") {
                        var stringItems = response.getReturnValue();
                       //  alert('@@@@@ Records updated');
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            title : 'Success Message',
                            //message: 'Record is created Successfully',
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
                    }
                    
                    
                }); 
                $A.enqueueAction(action2);
            
            } 
        });
        $A.enqueueAction(action);
 } ,
       validateRequired: function(component, event, helper) {
        
        var isValid = true;
        
        var RXOrderItemList =[];
        var SupplyOrderItemList = [];
        
        RXOrderItemList = component.get("v.RXOrderItemList");
        SupplyOrderItemList =  component.get("v.SupplyOrderItemList");
        
        for (var indexVar = 0; indexVar < RXOrderItemList.length; indexVar++) {
            
            if (RXOrderItemList[indexVar].Quantity_On_Hand__c == '' || 
                 RXOrderItemList[indexVar].Quantity_On_Hand__c == undefined) {
                isValid = false;
                //alert('Quantity On Hand should not be Blank')
               this.showToast1('error','Error Message','Quantity On Hand should not be Blank');
            }
            if (RXOrderItemList[indexVar].Quantity_Needed__c == ''|| 
                 RXOrderItemList[indexVar].Quantity_Needed__c == undefined) {
                isValid = false;
                
              this.showToast1('error','Error Message','Quantity Needed should not be Blank');
            }
        }
        return isValid;
    },  
   showToast1 : function(type,title,message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : title,
            message: message,
            duration:'10000',
            key: 'info_alt',
            type: type,
            mode: 'pester'
            
        });
        toastEvent.fire(); 
    } ,
    
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
                // alert(JSON.stringify(response.getReturnValue()));
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
    
    
    addOrderProdRecord: function(component, event) {
        
        var OrderProductList = component.get("v.OrderProductList");
    
        OrderProductList.push({
            'sobjectType': 'OrderItem',
            'Product2.Name': '',
            'Previous_Quantity__c': '',
            'Quantity_On_Hand__c': '',
            'Quantity_Needed__c': '',
            'UnitPrice': '',
            'Rx_Number__c': '',
            'PANumber__c': '',
            'Insurance__c': '',
        });
        component.set("v.OrderProductList", OrderProductList);
    },
    supplyaddOrderProdRecord: function(component, event) {
        
        var supplyOrderProductList = component.get("v.supplyOrderProductList");
       
        supplyOrderProductList.push({
            'sobjectType': 'OrderItem',
            'Category__c': '',
            'Product2.Name': '',
            'Previous_Quantity__c': '',
            'Quantity_Needed__c': '',
            'Quantity_In_Stock__c': '',
            'UnitPrice': ''
        });
        component.set("v.supplyOrderProductList", supplyOrderProductList);
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
                // alert(JSON.stringify(response.getReturnValue()));
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
  
   	PassingtoPharmacyWorkingUsingOrder : function(component, event, helper){
        
      
        var sendorder = component.get('v.Order');
         sendorder.Id =  component.get('v.recordId');
         sendorder.Order_Step__c =  'Pharmacy Working' ;  
           var action = component.get('c.createOrderRec');
            action.setParams({
                       "orderRecord" : sendorder
            });
       
            action.setCallback(this, $A.getCallback(function (response) {
                
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Success Message',
                    message: 'Order created Successfully',
                    messageTemplate: 'Record {0} created! See it {1}!',
                    duration:' 5000',
                    key: 'info_alt',
                    type: 'success',
                    mode: 'pester'
                });
                // toastEvent.fire();
                var state = response.getState();
                if (state === "SUCCESS") {
                    
                    
                    
                  
                    var untitleProject = response.getReturnValue();
                    message = 'Order Updated Successfully.';
                    //Redirecting to shipping component along with orderId and clientId
                    
                    var GetOrderStep = component.getEvent('HOG_GetOrderStep');
                    GetOrderStep.setParams({
                        "nextstep"    :    "2" 
                    }); 
                    GetOrderStep.fire();
                  
                 //   var appEvent = $A.get("e.c:HOG_ProductInsuranceCreationEvent");
                 //  appEvent.fire();
                     
                  
                    
                    
                    
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

})