({
    //Helper method to display the error toast message
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
	createRXObjectData: function(component, event) {
        // get the contactList from component and add(push) New Object to List  
        var OrderProductList = component.get("v.RXOrderItemList");
        
        OrderProductList.push({
            'sobjectType': 'OrderItem',
            'ProductCode__c': '',
            'Previous_Quantity__c': '',
            'Quantity_On_Hand__c': '',
            'Quantity_Needed__c': '',
            'Prior_Authorization1__c':'',
            'UnitPrice': ''
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
            component.set("v.prodtemps",result);
            
        });
        $A.enqueueAction(action);
    },
    getorderitems : function(component, event,helper) {
        //component.set("v.getActivePrescriptionProducts",true);
        var action = component.get("c.getexistingproducts");
        var OrderId = component.get('v.OrderId');
        action.setParams({
                    OrderId  : OrderId,
                     });
        action.setCallback(this, function(response){
            var rxlist =[];
            var supply =[];
            var result =response.getReturnValue();
            
           
            for(var i=0;i<result.length;i++){
                
                if(result[i].Product_Type__c == 'Rx' || result[i].Product_Type__c == 'Factor' 
                   || result[i].Product_Type__c == 'Dummy product' ){
                    rxlist.push(result[i]);
                   
                 }else if(result[i].Product_Type__c == 'Supply'){
                    supply.push(result[i]);
                     alert(result[i].Product_Group__c);
                 }
               }
            component.set("v.RXOrderItemList",[]);
            component.set("v.SupplyOrderItemList",[]);
            component.set("v.RXOrderItemList",rxlist);
            component.set("v.SupplyOrderItemList",supply);
            var rx = component.get("v.RXOrderItemList");
            
            if(rx.length == 0){
                
                this.getActivePrescriptionProducts(component, event); 
            }
                        
        });
        $A.enqueueAction(action);
    },
    saveOrderprodfromorderitem: function(component, event) {
        
        var action = component.get("c.priceBookEntryObj");
         var ProdIds =[];
        var RXOrderItemList =[];
        var SupplyOrderItemList = [];
        
        RXOrderItemList = component.get("v.RXOrderItemList");
        SupplyOrderItemList =  component.get("v.SupplyOrderItemList");
        
      //  supplylist =  component.find("suppyorderitem").get("v.OrderItemList");
        for(var i=0;i<RXOrderItemList.length;i++){
            ProdIds.push(RXOrderItemList[i].ProductCode__c);
            //(RXOrderItemList[i].ProductCode__c);
           }
        for(var i=0;i<SupplyOrderItemList.length;i++){
            ProdIds.push(SupplyOrderItemList[i].ProductCode__c);
            //alert(SupplyOrderItemList[i].ProductCode__c);
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
              // alert(JSON.stringify(stringItems));
                component.set("v.pricebookEntryvalue", stringItems); 
                
                //Save Order COde Starts Here
                
                var recordId = component.get("v.recordId");
                var prBookID = component.get("v.pricebookEntryvalue"); 
               
                var selectedprods = [];
                for(var i=0;i<prBookID.length;i++){
                    selectedprods.push(prBookID[i].Id); 
                   
                }
                var action2 = component.get("c.saveOrderprodfromorderitem");
                RXOrderItemList = component.get("v.RXOrderItemList");
               // alert(JSON.stringify(RXOrderItemList));
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
                      //   alert(JSON.stringify(stringItems));
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
                    }//Error code ends 
                    
                    
                }); 
                $A.enqueueAction(action2);
            
            }
        });
        $A.enqueueAction(action);
    },
    getActivePrescriptionProducts: function(component, event) {
          var clientIDval = component.get("v.Order");
      //   var selProduct = RXOrderItemList[i].ProductCode__c;
        var action = component.get("c.getActPresPrdValues");
        action.setParams({
                    ClientId  : clientIDval.Client_Chart__c,
                    RxPreordID : clientIDval.Previous_Order_ID__c 
                });
        action.setCallback(this, function(response) {
             var rxlist =[];
            var state = response.getState();
            if (state === "SUCCESS") {
                var stringItems = response.getReturnValue();
            //   alert('226'+JSON.stringify(stringItems));
                component.set("v.selectedActProds", stringItems);
                var RXOrderItemList1 = component.get("v.selectedActProds"); 
               for(var i=0;i<stringItems.length;i++){
                   var RXListdata = {ProductCode__c : stringItems[i].ProductCode__c,
                                     Quantity_Needed__c : stringItems[i].Quantity_Needed__c,
                                     Prior_Authorization1__c : stringItems[i].Prior_Autorization11__c ,
                                     Previous_Quantity__c : stringItems[i].Previous_Quantity__c,
                                     Dosing__c : stringItems[i].Dosing__c,
                                     Product_Family__c : stringItems[i].Product_Family__c,
                                     Product_Group__c : stringItems[i].Product_Group__c
                                    };
                rxlist.push(RXListdata);
                    component.set("v.RXOrderItemList", rxlist);
               }
               
                
             
       //  this.getpriorAuthorization(component, event);
            
            }
        });
        $A.enqueueAction(action);
    },
    
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
    
})