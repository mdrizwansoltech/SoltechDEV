@isTest 
private class RFFCopyCommentTestClass {
    static testMethod void validateTriggerApproverRFF() {
       String RecTypeId= '0121H000001If6BQAS';
       Account acct = new Account(RecordTypeID=RecTypeId, FirstName='Test FName', LastName='Test LName');
       insert acct;
       
       Request_For_Funds__c rff= new Request_For_Funds__c(Client__c=acct.Id);
       rff.Copy_Comment__c=false;
       insert rff;

       rff.Copy_Comment__c=true;
       update rff;
       
       System.debug('Request for Funds: ' + rff.Id);

        // Perform test
        Test.startTest();
        Database.DeleteResult result = Database.delete(rff, false);
        Test.stopTest();
        System.assert(result.isSuccess());
    }
}