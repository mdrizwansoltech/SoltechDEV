({
	doinit : function(component, event, helper) {
		 helper.getorderDetails(component, event);
          var ProductId = component.get("v.ProductId");
        
          var action = component.get("c.getAssetDetails");
         action.setParams({  		
            ProductId  : ProductId
        });
         alert('AssetResult0');
        action.setCallback(this, function(response){
        var state = response.getState();
             alert('AssetResult');
        if (state === "SUCCESS") {
            var AssetResult = response.getReturnValue();
            if(AssetResult.length>0 && AssetResult != null && AssetResult !='' && AssetResult != undefined)
            {          
               // component.set('v.AssetItemList',AssetResult);
               
               component.set('v.AssetItemList',AssetResult);
            }
           alert('AssetResult'+AssetResult);
        }
    });
    $A.enqueueAction(action);
        
	},
    AddToKit: function(component, event, helper) {
        var SelectedList=[];
       var SelectedAssets=component.get('v.AssetItemList');
        for(var i=0;i<SelectedAssets.length;i++){
            if(SelectedAssets[i].Quantity>0){
            SelectedList.push(SelectedAssets[i]);
            }
        }
        component.set('v.SelectedAssetItemList',SelectedList);
                       
},
    onCheck: function(component, event, helper) {
        
        var ea=event.getSource().get("v.value");
        component.set('v.InstockFlag',ea);
    },
    
        CancelPHPVarification: function(component, event, helper) {
           
           

            },
              NextPHPVarification: function(component, event, helper) {
            
            
            },
    QuantityCheck: function(component, event, helper) {
          var SelectedList=[];
        
      var inStackval=component.get('v.InstockFlag');
         var SelectedAssets=component.get('v.AssetItemList');
           for(var i=0;i<SelectedAssets.length;i++){
            if(inStackval && SelectedAssets[i].Quantity > SelectedAssets[i].Quantity_In_Stock__c){
           
                var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Error Message',
            message:' Quantity should not greater then Quantity_In_Stock',
          
            duration:' 5000',
            key: 'info_alt',
            type: 'error',
            mode: 'pester'
        });
        toastEvent.fire();
            SelectedList.push(SelectedAssets[i]);
                   
               }
                 
        }
    
                   // component.set('v.AssetItemList',SelectedList); 
        
    }
})