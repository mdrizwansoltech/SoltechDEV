trigger TriggerApprover on Client_Encounter__c (before update) {
       if(trigger.isUpdate){
             List<Client_Encounter__c> encounterList =  [Select id,
                                                   (Select Id, 
                                                         IsPending, 
                                                         ProcessInstanceId, 
                                                         TargetObjectId, 
                                                         StepStatus, 
                                                         OriginalActorId, 
                                                         ActorId, 
                                                         RemindersSent, 
                                                         Comments, 
                                                         IsDeleted, 
                                                         CreatedDate, 
                                                         CreatedById, 
                                                         SystemModstamp 
                                                    FROM ProcessSteps
                                                ORDER BY CreatedDate DESC) 
                                                    From Client_Encounter__c
                                                WHERE Id IN : Trigger.new];

             if(encounterList.size() > 0){

               for(Client_Encounter__c encounter : encounterList){
              
                for(Client_Encounter__c encounter1 : Trigger.new) {
                  
                         //check copy comment is true
                         if(encounter.id == encounter1.id && encounter1.copy_comment__c) {
 
                           if (encounter.ProcessSteps.size() > 0) {
                            
                         encounter1.Approval_Notes__c = 'Approval Request Denied: ' + encounter.ProcessSteps[0].Comments;
                         encounter1.copy_comment__c = false;
                
                           }

                        }
                 
                    }
               }
             }   
        }  
}