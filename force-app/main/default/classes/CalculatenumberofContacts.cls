public class  CalculatenumberofContacts
{
    //When a Contact is Created or deleted 
    //then calculate the "No of Contacts" on Account 
    
    
    
    
    public static void CalculatenumberofContactsOnInsert (List<contact> conlist)
     {
         set<Id> accountIdSet =new set<Id>();
         
         MAp<ID,Account> accountMap = new Map<Id,Account>();
         
         
         for(Contact contactobj : conlist)
           {
               if(contactobj.AccountId != Null) 
                  {
                      accountIdSet.add(contactobj.AccountId);
                  }
               
           }
         
              if(accountIdSet !=Null && accountIdSet.size()>0)
                 {
                    for(AggregateResult aggrObj : [SELECT Count(id) contactcount ,AccountID from contact 
                                                   WHERE AccountID in :accountIdSet GROUP BY AccountID] )
                        
                        {
                            account accobj = new account();
                            
                            accobj.Id = (Id)aggrObj.get('accountID');
                            accobj.No_ofContacts__c = (Integer)aggrObj.get('contactcount');
                            
                            accountMap.put(accobj.Id, accobj);
                        }
                  
                      
                     
                     if(accountMap != NUll && accountMap.size()>0)
                        {
                            update accountMAp.values();
                        }
                 }
     }

    
    
    
        public static void CalculatenumberofContactsOnDeletion (List<contact> conlist)
     {
         set<Id> accountIdSet =new set<Id>();
         
         MAp<ID,Account> accountMap = new Map<Id,Account>();
         
         
         for(Contact contactobj : conlist)
           {
               if(contactobj.AccountId != Null) 
                  {
                      accountIdSet.add(contactobj.AccountId);
                  }
               
           }
         
              if(accountIdSet !=Null && accountIdSet.size()>0)
                 {
                    for(AggregateResult aggrObj : [SELECT Count(id) contactcount ,AccountID from contact 
                                                   WHERE AccountID in :accountIdSet AND Id NOT IN :conlist GROUP BY AccountID] )
                        
                        {
                            account accobj = new account();
                            
                            accobj.Id = (Id)aggrObj.get('accountID');
                            accobj.No_ofContacts__c = (Integer)aggrObj.get('contactcount');
                            
                            accountMap.put(accobj.Id, accobj);
                        }
                  
                      
                     
                     if(accountMap != NUll && accountMap.size()>0)
                        {
                            update accountMAp.values();
                        }
                 }
     }
    
    
}