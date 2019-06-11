({
	doInit : function(component, event, helper) {
	var presTargtHighLowvallist = component.get("v.Prescrptnprofilelst");	
      alert('HighLowValues'+JSON.stringify(presTargtHighLowvallist));
     /*  var presTargtHighLowvallist = [];
        for(var i=0;i<presTargtHighLowvallist.length;i++){
            alert('InsideForLoop'+JSON.stringify(presTargtHighLowvallist));
   component.set("v.Prescrptnprofilelst.Target__c",presTargtHighLowvallist[i].Target__c);
             component.set("v.Prescrptnprofilelst.High__c",presTargtHighLowvallist[i].High__c);
             component.set("v.Prescrptnprofilelst.Low__c",presTargtHighLowvallist[i].Low__c);
            alert('Target Value'+JSON.stringify(Prescrptnprofilelst.Target__c))
        }*/
	}
})