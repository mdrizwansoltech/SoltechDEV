({
    //Helper method to display the error toast message
    showToast : function(type,title,message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : title,
            message: message,
            duration:'10000',
            key: 'info_alt',
            type: type,
            mode: 'dismissible'
        });
        toastEvent.fire(); 
    },
    validateRequired: function(component, event, helper) {
        var isValid = true;
        var DeliverByDate = component.find("DeliverByDateID").get("v.value");
        var Instructions = component.find("Instructions").get("v.value");
        var CurrentDate = $A.localizationService.formatDate(new Date(), "YYYY-MM-DD");
        var DeliverByDate1 =$A.localizationService.formatDate(DeliverByDate, "YYYY-MM-DD");
        
        
        if(DeliverByDate === "" || DeliverByDate === null ||  DeliverByDate === undefined 
           || DeliverByDate1 <  CurrentDate 
           || Instructions == undefined || Instructions == '' || Instructions == null){
            
        if(DeliverByDate === "" || DeliverByDate === null ||  DeliverByDate === undefined ) {
            helper.showToast('error','Error Message','Delivery By Date Should not be Blank'); 
           
        }
        if ( DeliverByDate1 < CurrentDate ) {
            helper.showToast('error','Error Message','Delivery By Date Should be greater or Equal to todays date'); 
            
        }
        if(Instructions == undefined || Instructions == '' || Instructions == null){
            helper.showToast('error','Error Message','Please Enter Instructions before Proceeding');
            event.preventDefault(); // stop form submission
        } 
        }else{
        return isValid;
            
        }
    }
})