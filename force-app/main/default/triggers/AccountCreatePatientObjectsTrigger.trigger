trigger AccountCreatePatientObjectsTrigger on Account (before insert, before update, after insert, after update) {
    
    for( Account ac : Trigger.new)
    {
        if (ac.HealthCloudGA__MedicalRecordNumber__c != null && ac.HealthCloudGA__MedicalRecordNumber__c != '')
        {
            if (Trigger.isBefore)
            {
                if (Trigger.isInsert){
                    string codeToMatch = ac.HealthCloudGA__MedicalRecordNumber__c;
                    Account[] dupAccount = [SELECT Id, HealthCloudGA__MedicalRecordNumber__c FROM Account WHERE HealthCloudGA__MedicalRecordNumber__c = :codeToMatch];
                    if (dupAccount.size() != 0)
                    {
                        ac.HealthCloudGA__MedicalRecordNumber__c.addError('MRN is already used. Please choose another');
                    }
                }
            }
            else if (Trigger.isAfter)
            {
                if (Trigger.isInsert)
                {
                    HealthCloudGA__EhrPatient__c newpatient = new HealthCloudGA__EhrPatient__c();
                    newpatient.HealthCloudGA__Account__c = ac.Id;
                    newpatient.HealthCloudGA__MedicalRecordNumber__c = ac.HealthCloudGA__MedicalRecordNumber__c;
                    newpatient.HealthCloudGA__SourceSystem__c = ac.HealthCloudGA__SourceSystem__c;
                    
                    insert newpatient;
                    
                    HealthCloudGA__EhrCarePlan__c careplan = new HealthCloudGA__EhrCarePlan__c();
                    careplan.HealthCloudGA__Account__c = ac.Id;
                    careplan.HealthCloudGA__Patient__c = newpatient.Id;
                    careplan.HealthCloudGA__SourceSystem__c = newpatient.HealthCloudGA__SourceSystem__c;
                    
                    insert careplan;
                }

                if (Trigger.isUpdate)
                {
                    // write some logic for updating MRN
                }
            }
        }
        else 
        {
            string codeToMatch = ac.Id;

            if (Trigger.isBefore)
            {
                // if (ac.IsPersonAccount)
                // {
                //     if (!ac.Is_A_Client__c && currentprofile.size() != 0) {
                //         ac.Is_A_Client__c.addError('User cannot be removed as a client.');
                //     }
                //     if (!ac.Is_A_Donor__c && currentdonorprofile.size() != 0) {
                //         ac.Is_A_Donor__c.addError('User cannot be removed as a donor.');
                //     }
                //     if (!ac.Is_A_Medical_Professional__c && currentmpprofile.size() != 0) {
                //         ac.Is_A_Medical_Professional__c.addError('User cannot be removed as a medical professional.');
                //     }
                //     if (!ac.Is_A_Volunteer__c && currentvolunteerprofile.size() != 0) {
                //         ac.Is_A_Volunteer__c.addError('User cannot be removed as a volunteer.');
                //     }
                // }
            }
            else if (Trigger.isAfter)
            {
                Boolean shouldUpdateAccount = false;

                Account savedAccount = null;
                Account[] savedAccounts = [SELECT Id FROM Account WHERE Id = :codeToMatch];
                if (savedAccounts.size() != 0){
                    savedAccount = savedAccounts[0];
                }

                if (ac.IsPersonAccount)
                {

                    if (ac.Is_A_Client__c)
                    {
                            Client_Chart__c[] currentprofile = [SELECT Id FROM Client_Chart__c WHERE Account__c = :codeToMatch];
                            if (currentprofile.size() == 0)
                            {
                                Client_Chart__c newClientChart = new Client_Chart__c();
                                newClientChart.Account__c = ac.Id;
                                newClientChart.Medical_Record_Number__c = ac.HealthCloudGA__SourceSystemId__c;

                                insert newClientChart;

                                if (savedAccount != null){
                                    savedAccount.Client_Chart_Lookup__c = newClientChart.Id;
                                    shouldUpdateAccount = true;
                                }

                            }
                    } 
                    if (ac.Is_A_Donor__c)
                    {
                        Donor_Profile__c[] currentdonorprofile = [SELECT Id FROM Donor_Profile__c WHERE Account__c = :codeToMatch];
                        if (currentdonorprofile.size() == 0)
                            {
                                Donor_Profile__c newDonorProfile = new Donor_Profile__c();
                                newDonorProfile.Account__c = ac.Id;
                                newDonorProfile.Donor_Type__c = 'Individual';

                                insert newDonorProfile;

                                if (savedAccount != null){
                                    savedAccount.Donor_Profile_Lookup__c = newDonorProfile.Id;
                                    shouldUpdateAccount = true;
                                }

                            }
                    }
                    if (ac.Is_A_Medical_Professional__c)
                    {
                        Medical_Professional_Profile__c[] currentmpprofile = [SELECT Id FROM Medical_Professional_Profile__c WHERE Account__c = :codeToMatch];
                        if (currentmpprofile.size() == 0)
                            {
                                Medical_Professional_Profile__c newMPProfile = new Medical_Professional_Profile__c();
                                newMPProfile.Account__c = ac.Id;

                                insert newMPProfile;

                                if (savedAccount != null){
                                    savedAccount.Medical_Professional_Profile_Lookup__c = newMPProfile.Id;
                                    shouldUpdateAccount = true;
                                }

                            }
                    }
                    if (ac.Is_A_Volunteer__c)
                    {
                        Volunteer_Profile__c[] currentvolunteerprofile = [SELECT Id FROM Volunteer_Profile__c WHERE Account__c = :codeToMatch];
                        if (currentvolunteerprofile.size() == 0)
                            {
                                Volunteer_Profile__c newVolunteerProfile = new Volunteer_Profile__c();
                                newVolunteerProfile.Account__c = ac.Id;

                                insert newVolunteerProfile;

                                if (savedAccount != null){
                                    savedAccount.Volunteer_Profile_Lookup__c = newVolunteerProfile.Id;
                                    shouldUpdateAccount = true;
                                }

                            }
                    }
                }
                else
                {
                    if (ac.Is_A_Donor__c)
                    {
                        Donor_Profile__c[] currentdonorprofile = [SELECT Id FROM Donor_Profile__c WHERE Account__c = :codeToMatch];
                        if (currentdonorprofile.size() == 0)
                            {
                                Donor_Profile__c newDonorProfile = new Donor_Profile__c();
                                newDonorProfile.Account__c = ac.Id;
                                newDonorProfile.Name = ac.Name;
                                newDonorProfile.Donor_Type__c = 'Unknown';

                                insert newDonorProfile;

                                if (savedAccount != null){
                                    savedAccount.Donor_Profile_Lookup__c = newDonorProfile.Id;
                                    shouldUpdateAccount = true;
                                }

                            }
                    }

                }
        
            if (shouldUpdateAccount){
                update savedAccount;
            }

           }
        }
    }
}