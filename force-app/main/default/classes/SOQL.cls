public class SOQL {
    public static void SOQLbasics()
        
    {   //parent to child SOQL on standard object
        
     List <Account> acclst =[Select id , Name ,           
                     (SELECT ID , Name from contacts)      // here 'contacts' is child relationship name in child object lookup field
                      from account WHERE NAme = 'JAy dixit'];
        
      system.debug('account details '+acclst);  // this will print account ID , NAME
        
      if(!acclst.isempty()){
         for(account acc : acclst){
        system.debug('related contact '+acc.contacts); // this will print account id and related contacts id and name
                                                      // for showing related records acc dot child relationship name 
    }
    }




        //parent to child SOQL on custom objects (remeber to use __r with lookup and __c with custom objects and fields)
        
        list<Studentc__c> stlst = new list <studentc__C>();
        
       
            for(studentc__c st : [SELECT Id , Student_Email__c, (select id , name from books__r) 
                                  from Studentc__C where student_name__c= 'harry']){
                system.debug('related books '+st.books__R); //it will print student  id with books id and name of boooks
            }
        



        // child to parent soql with standard object
        
                  list<contact> conlst = new list<contact>();
        
        for(contact con : [SELECT ID ,NAME , account.NAME from contact where name= 'hariom kharya 2'])
        {
           system.debug(' account name = '+con.ACCOUNT.NAME ); 
        }




        // child to parent soql on custom object              its not working dont know why; now it is working bcs i m using studentc__r whereas i have to use only student__R
        list<book__c> blist = new list <book__c> ();                                               
     
        for(book__C b : [select id, name , student__r.student_name__c
                         from book__C where name ='ajanta2']){
            system.debug(' '+b.student__r.student_name__c);
        }
         
       
    }
    }