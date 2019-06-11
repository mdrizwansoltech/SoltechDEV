trigger RelatedPartyCreateHouseholdsTrigger on Related_Party__c (after insert) {

    List<AccountContactRelation> accountContactRelations = new List<AccountContactRelation>();

    for( Related_Party__c rp : Trigger.new)
    {


        // Get the client account
        Account[] clientAccount = [select Id, HealthCloudGA__PrimaryContact__c, FirstName, LastName from Account
            where Id = :rp.Client_Account__c Limit 1];


        //Get any previous client households
        AccountContactRelation[] currentHouseHold = [select Id, AccountId from AccountContactRelation 
            where ContactId = :clientAccount[0].HealthCloudGA__PrimaryContact__c and Roles = 'Client' Limit 1];

        if (currentHouseHold.size() > 0) {

            // Get related party's account
            Account[] relatedAccount = [select Id, HealthCloudGA__PrimaryContact__c from Account
            where Id = :rp.Related_Party_Account__c Limit 1];

            if (relatedAccount.size() > 0) {
                AccountContactRelation acr = new AccountContactRelation();
                acr.IsActive = true;
                acr.AccountId = currentHouseHold[0].AccountId;
                acr.ContactId = relatedAccount[0].HealthCloudGA__PrimaryContact__c;
                acr.Roles = rp.Relationship_Type__c;
                accountContactRelations.add(acr);
            }
        } else {
            Map<String, Schema.RecordTypeInfo> recordTypes = Schema.SObjectType.Account.getRecordTypeInfosByName();
            Id customRecTypeId = recordTypes.get('Household').getRecordTypeId();

            Account houseHoldAccount = new Account();
            houseHoldAccount.Name = clientAccount[0].FirstName + ' ' + clientAccount[0].LastName + ' Household';
            houseHoldAccount.RecordTypeId = customRecTypeId;
            insert houseHoldAccount;

            Account[] relatedAccount = [select Id, HealthCloudGA__PrimaryContact__c from Account
            where Id = :rp.Related_Party_Account__c Limit 1];

            AccountContactRelation acrc = new AccountContactRelation();
            acrc.IsActive = true;
            acrc.AccountId = houseHoldAccount.Id;
            acrc.ContactId = clientAccount[0].HealthCloudGA__PrimaryContact__c;
            acrc.Roles = 'Client';
            insert acrc;
            //accountContactRelations.add(acrc);

            if (relatedAccount.size() > 0) {
                AccountContactRelation acr = new AccountContactRelation();
                acr.IsActive = true;
                acr.AccountId = houseHoldAccount.Id;
                acr.ContactId = relatedAccount[0].HealthCloudGA__PrimaryContact__c;
                acr.Roles = rp.Relationship_Type__c;
                accountContactRelations.add(acr);
            }

        }
    }

    if (accountContactRelations.size() > 0) {
        insert accountContactRelations;
    }
}