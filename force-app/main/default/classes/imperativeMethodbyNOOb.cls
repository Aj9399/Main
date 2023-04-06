public class imperativeMethodbyNOOb 
{
    @AuraEnabled
    public static list<book__c> getbooklst()
        
    {
        list<book__c> booksinRecords = [SELECT ID , NAME FROM book__c];
        return booksinRecords;
    }
}