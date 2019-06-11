trigger PRNApexSharing on Client_Chart__c (after insert, after update) {

    if(trigger.isInsert || trigger.isUpdate)
    {
        // Create a new list of sharing objects for Job
        List<Client_Chart__Share> clientShares  = new List<Client_Chart__Share>();
        List<AccountShare> acctShares = new List<AccountShare>();
        List<Address__Share> addressShares = new List<Address__Share>();

        //Declare PRN Client Share Variable
        Client_Chart__Share prnShare;
        
        
        for (Client_Chart__c client : trigger.new) {
            if(client.Assigned_PRN__c != null) {
            
                prnShare = new Client_Chart__Share();
                prnShare.ParentId=client.Id;
                
                prnShare.UserOrGroupId = client.Assigned_PRN__c;
    
                prnShare.AccessLevel = 'edit';
                prnShare.RowCause = Schema.Client_Chart__Share.RowCause.PRN_Share__c;
                
                clientShares.add(prnShare);
                
                if(client.Account__c!=null) {
                    //Update the Account Sharing
                    Id acctId = client.Account__c;
                    AccountShare accountShare = new AccountShare(AccountId = acctId);
                    accountShare.UserOrGroupId = client.Assigned_PRN__c;
                    accountShare.AccountAccessLevel = 'Edit';
                    accountShare.CaseAccessLevel = 'Edit';
                    accountShare.OpportunityAccessLevel = 'Edit';
                    acctShares.add(accountShare);
                    
                    Address__c[] addresses = [select id from Address__c where Account__c = :acctId];
                    for (Address__c address :addresses){
                        Address__Share addressShare = new Address__Share(ParentId=address.Id);
                        addressShare.UserOrGroupId = client.Assigned_PRN__c;
                        addressShare.AccessLevel = 'edit';
                        addressShares.add(addressShare);
                    }

                }
            }
        }
        Database.SaveResult[] lsr = Database.insert(clientShares,false);
        
        // Create counter
        Integer i=0;
        
        // Process the Client save results
        for(Database.SaveResult sr : lsr){
            if(!sr.isSuccess()){
                // Get the first save result error
                Database.Error err = sr.getErrors()[0];
                
                // Check if the error is related to a trivial access level
                // Access levels equal or more permissive than the object's default 
                // access level are not allowed. 
                // These sharing records are not required and thus an insert exception is 
                // acceptable. 
                if(!(err.getStatusCode() == StatusCode.FIELD_FILTER_VALIDATION_EXCEPTION  
                                               &&  err.getMessage().contains('AccessLevel'))){
                    // Throw an error when the error is not related to trivial access level.
                    trigger.newMap.get(clientShares[i].ParentId).
                      addError(
                       'Unable to grant sharing access due to following exception: '
                       + err.getMessage());
                }
            }
            i++;
        }   
        
        Database.SaveResult[] lsr2 = Database.insert(acctShares ,false);

        i=0;
        // Process the Account save results
        for(Database.SaveResult sr : lsr2){
            if(!sr.isSuccess()){
                // Get the first save result error
                Database.Error err = sr.getErrors()[0];
                
                // Check if the error is related to a trivial access level
                // Access levels equal or more permissive than the object's default 
                // access level are not allowed. 
                // These sharing records are not required and thus an insert exception is 
                // acceptable. 
                if(!(err.getStatusCode() == StatusCode.FIELD_FILTER_VALIDATION_EXCEPTION  
                                               &&  err.getMessage().contains('AccessLevel'))){
                    // Throw an error when the error is not related to trivial access level.
                    trigger.newMap.get(clientShares[i].ParentId).
                      addError(
                       'Unable to grant sharing access due to following exception: '
                       + err.getMessage());
                }
            }
            i++;
        }
        
        Database.SaveResult[] lsr3 = Database.insert(addressShares ,false);


    }
}