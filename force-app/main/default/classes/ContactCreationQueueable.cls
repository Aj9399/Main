/*     Account(shreekant)------->trigger(AccountTriggerforCntactCAllQueueableclass)------->queueableClass contact(shreekant)
 here we are inserting one record in account so the trigger will call and form triiger we want to call our queueable class 
  on contact



*/
  public class ContactCreationQueueable implements queueable

{  //here we have to call constructor and in queueable we can take sobjects as parameters
    
       private list<account> acclistTocreateContacts;
    
       public ContactCreationQueueable(list<account> expectingAccountsFromtriggers)
       {
           this.acclistTocreateContacts = expectingAccountsFromtriggers;
        
       }
    
       public void Execute(queueableContext qcont)
       {  list<contact> conlstToinsert = new list<contact>();
        
           for(account acc :acclistTocreateContacts)
           {
               contact con = new contact();
               con.lastname = acc.name;
               con.accountId = acc.id;

           }
             if(conlstToinsert.size()>0)
               insert conlstToinsert;
       }
           
}