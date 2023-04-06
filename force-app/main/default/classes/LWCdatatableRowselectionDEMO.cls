public class LWCdatatableRowselectionDEMO 
{  @AuraEnabled(cacheable = true)
    public static list <contact> getACCcontactLIST(Id lwcRecordId)
        
    {
       list<contact> conlist = [SELECT ID, NAME , Phone,AccountID from contact where AccountID =:lwcRecordId  limit 10];
        
        return conlist;
    }
    
    
}