@isTest(SeeAllData=true)
private class TestUpdateEncounterActivities {

    public static testMethod void testEncounter(){

        // GET USER FROM USER TABLE...
        User[] users = [select name, Id FROM user where name ='HOGSF1 Soltech'];
        if (users.size() > 0)
        {
            User u = users[0];
            // RUN AS USER...
            system.runAs(u)
            {
                Client_Chart__c[] clientcharts = [select name, Id FROM Client_Chart__c];
                if (clientcharts.size() > 0)
                {
                    Client_Chart__c cc = clientcharts[0];
                    
                    Client_Encounter__c ce = new Client_Encounter__c();
                    ce.Client_Chart__c = cc.Id;
                    ce.Counseling__c = True;
                    ce.Location_Type__c = 'Home';
                    ce.Consent_Form_Attached__c = 'Consent form is attached';
                    ce.Encounter_Date__c = Date.today();
                    ce.Encounter_Type__c = 'Face-To-Face';
                    
                    upsert ce;
                    ce.Counseling__c = False;
                    upsert ce;

                }
            }
        }
               
    }
}