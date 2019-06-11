trigger UpdateEncounterActivities on Client_Encounter__c (after insert, after update) {
    
    List<Encounter_Activity__c> currentEncounterActivities = new List<Encounter_Activity__c>();
    List<Encounter_Activity__c> encounterActivitiesToUpsert = new List<Encounter_Activity__c>();
    List<Encounter_Activity__c> encounterActivitiesToDelete = new List<Encounter_Activity__c>();
    Map<String, Integer> activityFields = new Map<String, Integer>();
    activityFields.put('Social_Worker_Assessment__c', 1);
    activityFields.put('Counseling__c', 2);
    activityFields.put('Infusion_Training_Review__c', 3);
    activityFields.put('Infusion_Training_Complete__c', 4);
    activityFields.put('Infusion_Training_Review_Port__c', 5);
    activityFields.put('Infusion_Training_Port_Complete__c', 6);
    activityFields.put('Bleeding_Disorder_Education__c', 7);
    activityFields.put('HIV_Education__c', 8);
    activityFields.put('Hepatitis_Education__c', 9);
    activityFields.put('Genetics_Education__c', 10);
    activityFields.put('Comprehensive_Care_Education__c', 11);
    activityFields.put('UDC_Education__c', 12);
    activityFields.put('DDAVP_Education_Review__c', 13);
    activityFields.put('General_Health_Wellness_Education__c', 14);
    activityFields.put('Consumer_Issues_Education__c', 15);
    activityFields.put('In_service__c', 16);
    activityFields.put('Other_Community_Consultation__c', 17);
    activityFields.put('Community_Agency_Recommendation__c', 18);
    activityFields.put('Performing_Clinical_Procedure__c', 19);
    activityFields.put('Medic_Alert_Order__c', 20);
    activityFields.put('Pedigree_Update__c', 21);
    activityFields.put('Status_Check__c', 22);
    activityFields.put('H_O_G_Services_Education__c', 23);
    activityFields.put('Recall_Education__c', 24);
    activityFields.put('Vocational_Guidance__c', 25);
    activityFields.put('Financial_Assistance__c', 26);
    activityFields.put('X27_Follow_Up__c', 27);
    activityFields.put('Unsuccessful_Contact__c', 28);
    activityFields.put('Joint_Bleed_Identification_Educatio__c', 29);
    activityFields.put('Emergency_Action_Plan__c', 30);
    activityFields.put('Social_Worker_Case_Management_Plan__c', 31);
    activityFields.put('HOG_Activity__c', 32);
    activityFields.put('QA_Followup__c', 33);
    activityFields.put('Annual_Comp_Care_Eval__c', 34);
    activityFields.put('Six_Month_Followup__c', 35);
    activityFields.put('X36_Follow_Up__c', 36);
    activityFields.put('Office_Visit__c', 37);
    activityFields.put('ER_Visit__c', 38);
    activityFields.put('HTC_Education_Counseling__c', 39);
    activityFields.put('Regimen_Started__c', 40);
    activityFields.put('Advocacy_Education__c', 41);
    activityFields.put('Regimen_Completed__c', 42);
    activityFields.put('Hospitalization__c', 43);
    activityFields.put('Regimen_Noncompliance__c', 44);
    activityFields.put('Mighty_Sticker_Club__c', 45);
    activityFields.put('SWQA_Follow_up__c', 46);
    activityFields.put('Review_existing_emergency_action_pl__c', 47);
    activityFields.put('Timely_Care_Education__c', 48);
    activityFields.put('Pain_Inquiry__c', 49);
    activityFields.put('English_Handbook__c', 50);
    activityFields.put('Spanish_Handbook__c', 51);
    activityFields.put('vWD_Handbook__c', 52);
    activityFields.put('Client_Request_for_Emergency_Assis__c', 53);
    activityFields.put('Community_Resource_Utilization__c', 54);
    activityFields.put('Diagnosis_Education__c', 55);
    activityFields.put('Treatment_Calendar_Education__c', 56);
    activityFields.put('Mid_Year_Weight_Check__c', 57);
    activityFields.put('Nursing_Care_Plan__c', 58);
    activityFields.put('Factor_Order_Education__c', 59);
    activityFields.put('Emergency_Room_Visit_Follow_up__c', 60);
    activityFields.put('Prophylaxis_Review__c', 61);
    activityFields.put('Transitional_Education__c', 62);
    activityFields.put('Educational_Success__c', 63);
    activityFields.put('Renewal_of_Nursing_Care_Plan__c', 64);
    activityFields.put('New_Client_Visit__c', 65);
    activityFields.put('Current_Client_Visit__c', 66);
    activityFields.put('Inservice__c', 67);
    activityFields.put('Pharmacy_Representation__c', 68);
    activityFields.put('Client_Assistance_Program__c', 69);
    activityFields.put('Customer_Service__c', 70);
    activityFields.put('X71_Follow_Up__c', 71);
    activityFields.put('Insurance_Issues__c', 72);
    activityFields.put('Miscellaneous__c', 73);
    activityFields.put('Lost_Client_Visit__c', 74);
    activityFields.put('Potential_Client_Visit__c', 75);
    activityFields.put('ER_Visit_Code__c', 76);
    activityFields.put('Hospital_Admissions__c', 77);
    activityFields.put('Unscheduled_Physician_Visits__c', 78);
    activityFields.put('Days_missed_of_Work__c', 79);
    activityFields.put('Days_missed_of_School__c', 80);
    activityFields.put('QA_Pharmacy_Call__c', 81);
    activityFields.put('Aging_Education__c', 82);
    activityFields.put('Dental_Education__c', 83);
    activityFields.put('Nursing_Outreach_Form_Completed__c', 84);
    activityFields.put('Telemedicine__c', 85);
    activityFields.put('Assist_with_Medical_Procedure__c', 86);
    activityFields.put('Educate_clients_about_HTC_facility__c', 87);
    activityFields.put('Imported_PHS_Eligibility__c', 999);
    
    for( Client_Encounter__c ce : Trigger.new)
    {
        currentEncounterActivities = [SELECT Id, Encounter__c, Activity__r.Code__c FROM Encounter_Activity__c WHERE Encounter__c = :ce.Id];
        Map<String, Object> fieldsToValue = ce.getPopulatedFieldsAsMap();
        
        for (String fieldName : activityFields.keySet())
        {
            Integer keyNumber = integer.valueOf(activityFields.get(fieldName));
        
            Boolean valueOfField = Boolean.valueOf(fieldsToValue.get(fieldName));
            
            // check for id of key
            if (valueOfField == TRUE)
            {
                Encounter_Activity__c currentencounteractivity = null;
                for(Encounter_Activity__c ea : currentEncounterActivities)
                {
                    if (ea.Activity__r.Code__c == keyNumber)
                    {
                        currentencounteractivity = ea;
                        break;
                    }
                }
                
                if (currentencounteractivity == null)
                {
                    Activity__c correctActivity = [SELECT Id, Code__c FROM Activity__c WHERE Code__c = :keyNumber];
                    if (correctActivity != null)
                    {
                        Encounter_Activity__c newEncounterActivity = new Encounter_Activity__c();
                        newEncounterActivity.Activity__c = correctActivity.Id;
                        newEncounterActivity.Encounter__c = ce.Id;
                        encounterActivitiesToUpsert.add(newEncounterActivity);
                        
                    }
                }
            }
            else
            {
                Encounter_Activity__c currentencounteractivity = null;
                for(Encounter_Activity__c ea : currentEncounterActivities)
                {
                    if (ea.Activity__r.Code__c == keyNumber)
                    {
                        currentencounteractivity = ea;
                        break;
                    }
                }
                
                if (currentencounteractivity != null)
                {
                    encounterActivitiesToDelete.add(currentencounteractivity);
                }
            }
        
        }
    }
    
    try 
    {
        if (encounterActivitiesToUpsert !=null && !encounterActivitiesToUpsert.isEmpty()) 
        {
            upsert encounterActivitiesToUpsert;
        }
        if (encounterActivitiesToDelete !=null && !encounterActivitiesToDelete.isEmpty()) 
        {
            delete encounterActivitiesToDelete;
        }
    } 
    catch (DmlException e) 
    {
    
        System.debug(e.getMessage());
    }
}