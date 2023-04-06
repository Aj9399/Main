public class DMLbasics {
    public static void dmlinsrt()
    {
          // account acc = new account (name = 'jayyy' , phone = '8473874'); 
          // Insert acc;   // insert single record through DmL//
    
         // system.debug('accid ='+acc.id); we can check the id of the record
       
        // list<account> acclst = new list<account>();
           
        //account acc1 = new account (name = 'yess1' , phone = '84874'); 
        //account acc2= new account (name = 'nooo1' , phone = '84738'); 
        //insert acc1;     insert two record with two dml or individually
        //insert acc2;
        // now we create with the help of list 
     
         //  acclst.add(acc1);
        //acclst.add(acc2);
        //  system.debug('acc id'+acc1.id);           we can fetch the id 
        // insert acclst;                        insert two record with one DML(this is also known as bulk operation) 
        
      //  account acc = new account (name = 'yess1233' , phone = '8487498');  
       // insert acc;
        //contact con = new contact (Firstname =  'ss' , Lastname =  'yy' , AccountId = acc.id);
        //insert con;
                   //by insert account than insert there related record , it is insert related record	
                   
      // Account acc = [SELECT ID,NAME,phone from Account where NAME ='yess1233'];
       // system.debug(acc);
       // acc.phone = '99999' ;
      //  update acc;     update the record by dml
      
       // contact con = [select Id, firstname , lastname , phone , account.phone FROM contact where firstname = 'ss'AND lastname='yy'];
        
       // con.phone = '66666';
        //con.account.phone ='1234';
        //update con;
        //update con.account;
      
       
       // list <account> acclst = new list<account>();
        
      //  account acc1 = new  account (name = 'RAj', phone = '1212');
      //  account acc2 = [select id , name , phone from account where name = 'nooo'];
       // acc2.phone = '0101';
        //acclst.add(acc1);
        //acclst.add(acc2);
        // upsert acclst;                 // we can update and insert record (upsert)

    
    }
}