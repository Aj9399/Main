public class wireDemoClassByNOOB 
{  // here auraEnable means this class is called in LWC somewhere, but in () cacheable true refers to particular wire method.
     @AuraEnabled(cacheable = true) 
     public static List<book__c> getBooklist()
     {
       List<book__c> bookDetails = [SELECT ID , NAME FROM book__c];
         return bookDetails;
     }                             
}