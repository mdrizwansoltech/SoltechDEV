trigger EncounterDeleteSubForms on Client_Encounter__c (before delete) {
    //To store parent ids
    list<id> encounterIds=new list<id>();
    for(Client_Encounter__c encounterVar:trigger.old)
    {
        encounterIds.add(encounterVar.id);
    }  
    
    //Collecting all child Doc_Infusion_Consent_Form__c records related to Parent records
    list<Doc_Infusion_Consent_Form__c> listOfConsentForms=[select id from Doc_Infusion_Consent_Form__c where Encounter__c in :encounterIds];
    system.debug('listOfConsentForms'+listOfConsentForms);
    //deleting child records
    delete listOfConsentForms;
    
    //Collecting all child Doc_Emergency_Action_Plan__c records related to Parent records
    list<Doc_Emergency_Action_Plan__c> listOfEAPs=[select id from Doc_Emergency_Action_Plan__c where Encounter__c in :encounterIds];
    system.debug('listOfEAPs'+listOfEAPs);
    //deleting child records
    delete listOfEAPs;
    
    //Collecting all child Doc_Nursing_Assessment__c records related to Parent records
    list<Doc_Nursing_Assessment__c> listOfAssessments=[select id from Doc_Nursing_Assessment__c where Encounter__c in :encounterIds];
    system.debug('listOfAssessments'+listOfAssessments);
    //deleting child records
    delete listOfAssessments;
    
    //Collecting all child  Doc_Psychosocial_Assessment_CMP__c records related to Parent records
    list<Doc_Psychosocial_Assessment_CMP__c> listOfPSA=[select id from   Doc_Psychosocial_Assessment_CMP__c where Encounter__c in :encounterIds];
    system.debug('listOfAssessments'+listOfPSA);
    //deleting child records
    delete listOfPSA;      

}