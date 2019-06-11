trigger TriggerApproverRFF on Request_For_Funds__c (before update) {
       if(trigger.isUpdate){
             List<Request_For_Funds__c> rffList =  [Select id,
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
                                                    From Request_For_Funds__c
                                                WHERE Id IN : Trigger.new];

             if(rffList.size() > 0){

               for(Request_For_Funds__c rff : rffList){
              
                for(Request_For_Funds__c rff1 : Trigger.new) {
                  
                         //check copy comment is true
                         if(rff.id == rff1.id && rff1.copy_comment__c) {
 
                           if (rff.ProcessSteps.size() > 0) {
                            
                         rff1.Approval_Notes__c = 'Approval Request Denied: ' + rff.ProcessSteps[0].Comments;
                         rff1.copy_comment__c = false;
                
                           }

                        }
                 
                    }
               }
             }   
        }  
}