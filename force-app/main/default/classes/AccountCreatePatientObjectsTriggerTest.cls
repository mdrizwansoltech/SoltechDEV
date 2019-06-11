@isTest(SeeAllData=true)
private class AccountCreatePatientObjectsTriggerTest {

    public static testMethod void testAccountMedicalInfo(){

        // GET USER FROM USER TABLE...
        User[] users = [select name, Id FROM user where name ='HOGSF1 Soltech'];
        if (users.size() > 0)
        {
    		User u = users[0];
            // RUN AS USER...
            system.runAs(u)
            {
                string recordNumber = '3b06ba6d-a77e-49ad-88e9-62fb7ae4874a';
                string source = 'source';
                Account ac = new Account();
                ac.LastName = 'account';
                ac.HealthCloudGA__MedicalRecordNumber__c = recordNumber;
                ac.HealthCloudGA__SourceSystem__c = source;
                
                
                insert ac;

                Account newac = new Account();
                newac.LastName = 'newaccount';
                newac.Is_A_Volunteer__c = true;
                newac.Is_A_Client__c = true;
                newac.Is_A_Donor__c = true;
                newac.Is_A_Medical_Professional__c = true;

                insert newac;
                
                //Account acdup = new Account();
                //acdup.LastName = 'accountdup';
                //acdup.HealthCloudGA__MedicalRecordNumber__c = recordNumber;
                //acdup.HealthCloudGA__SourceSystem__c = source;
                //insert acdup;

            }
        }
               
    }
}