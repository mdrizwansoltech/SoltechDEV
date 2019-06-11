@isTest(SeeAllData=true)
private class RelatedPartyCreateHouseholdsTriggerTest {
    
    public static testMethod void testRelatedPartyHousehold(){

        // GET USER FROM USER TABLE...
        User[] users = [select name, Id FROM user where name ='HOGSF1 Soltech'];
        if (users.size() > 0)
        {
    		User u = users[0];
            // RUN AS USER...
            system.runAs(u)
            {
                Client_Chart__c[] clientchart = [select Id, Account__c FROM Client_Chart__c Limit 1];
                Account[] account = [select Id From Account Where IsPersonAccount = true Limit 2];
                
                Related_Party__c rp = new Related_Party__c();
                rp.Related_Party_Account__c = account[0].Id;
                rp.Client_Chart__c = clientchart[0].Id;
                rp.Client_Account__c = clientchart[0].Account__c;
                rp.Relationship_Type__c = 'Brother';

                insert rp;

                Related_Party__c rpa = new Related_Party__c();
                rpa.Related_Party_Account__c = account[1].Id;
                rpa.Client_Chart__c = clientchart[0].Id;
                rpa.Client_Account__c = clientchart[0].Account__c;
                rpa.Relationship_Type__c = 'Sister';

                insert rpa;

            }
        }

    }

}