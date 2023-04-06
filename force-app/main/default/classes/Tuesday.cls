public class Tuesday {
  public Static Void tue()
    {
   // Account A1 = new Account(Name =' Roy');   
   
   // Student__c st1 = new Student__c(Student_Name__c = 'Amit');
   
      sObject s1 = new Account(Name =' Nanu');
      sObject s = new Contact(lastName = 'Vedhya');
      sobject s3 = new Student__c(Student_Name__c = 'Ruby'); 
        
       //PUT method used to add values in generic sObject 
       
        s1.put('AccountNumber','3739832' );
        //s1.put('NumberOfEmployees', 45);
       // s1.put('YearStarted','2000');
        //Object objValue = (Decimal)s1.get('NumberofLocations__c');
        
        Object objValu = (String)s1.get('AccountNumber');
       // System.debug(objValue);
        system.debug(ObjValu);
    }
}