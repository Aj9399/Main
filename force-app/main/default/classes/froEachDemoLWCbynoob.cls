public class froEachDemoLWCbynoob 
{
  // here auraEnable means this class is called in LWC somewhere, but in () cacheable true refers to particular wire method.
     @AuraEnabled(cacheable = true) 
     public static List<book__c> allBookList()
     {
       List<book__c> BOOKidName = [SELECT ID , NAME FROM book__c];
         return BOOKidName;
     }                             

}