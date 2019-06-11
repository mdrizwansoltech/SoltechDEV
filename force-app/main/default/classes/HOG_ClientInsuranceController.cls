public without sharing class HOG_ClientInsuranceController {
    @AuraEnabled
    public static   List<Insurance_Coverage__c> getInsuranceInfo(String ClientId) {
        //system.debug('$$$$$$$$$$ '+ClientId);
        List<Insurance_Coverage__c> ListOfInsurance = new List<Insurance_Coverage__c>();
        try{
           ListOfInsurance = [Select id, Policy_Number__c,Coverage_Order__c,Category__c,Insurance_Provider__c,Insurance_Provider_Name__c,Plan_Name__c,Insured_Client__r.Name from Insurance_Coverage__c where Insured_Client__c =: clientId and InForce__c = true];
        }catch(exception e){
            
        }
        //system.debug('########## '+ListOfInsurance);
        return ListOfInsurance;
        
    }

}