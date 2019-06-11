@isTest 
private class EncounterDeleteSubFormsTestClass {
    static testMethod void validateEncounterDeleteSubForms() {
       String RecTypeId= [select Id from RecordType where (Name='Person Account') and (SobjectType='Account')].Id;
       Account acct = new Account(RecordTypeID=RecTypeId, FirstName='Test FName', LastName='Test LName');
       insert acct;
       
       Client_Chart__c client = new Client_Chart__c(Account__c=acct.Id);
       insert client;
       
       Client_Encounter__c ce = new Client_Encounter__c(Client_Chart__c=client.Id);
       insert ce;
       
       Doc_Infusion_Consent_Form__c icf = new Doc_Infusion_Consent_Form__c(Encounter__c=ce.Id);
       insert icf;

       System.debug('Client Encounter: ' + ce.Id);
       System.debug('Infusion Consent Form: ' + icf.Id);

        // Perform test
        Test.startTest();
        Database.DeleteResult result = Database.delete(ce, false);
        Test.stopTest();
        // Verify 
        // In this case the deletion should have been stopped by the trigger,
        // so verify that we got back an error.
        System.assert(result.isSuccess());
    }
}