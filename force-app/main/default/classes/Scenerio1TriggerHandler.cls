public class Scenerio1TriggerHandler 
{
    public static void updateRatingOnAcc(list <account> acclist)
    {
        for(Account acc : acclist)
        {
           acc.Rating = 'Hot'; 
            
        }  
 
    }
    
    
    
    
    
    public static void updateDescBasedOnAmountValue(list<opportunity> opplist)
    { 
        for(opportunity opp : opplist)
        {
            if(opp.Amount<5000)
            {
                opp.Description = 'some amount is due '+opp.Amount;
            }
          else
            {
                   opp.Description = 'amount is fully paid '+opp.Amount;
            }
            
        } 
        
    }
    
    
    

     public static void createConOnaccInsertion(list<account> acclst) 
         
     {
         list <Contact> conlist = new list <contact>();
         
         for(account acc : acclst)
         {
             contact con = new contact();
             con.lastName = 'testing '+acc.Name;
             con.phone  = acc.phone;  
             con.AccountId = acc.ID;
             conlist.add(con);
         }
         insert conlist;
         
     }
        
    
    public static void casenumberUpdateOnrelatedContact(list<case> caselist)
    {
        list<account> acclst = new list<account>();
        
        for(case c : caselist)
        {   if(case.AccountId != null)
          
          {
               account acc = new account();
               acc.id = c.AccountID;
               acc.Latest_case_number__c = c.CaseNumber;
              acclst.add(acc);
           }
            
        }
      
        update acclst;
 }
    
    
    public static void updateDescWhenPhoneUpadated(list<account> acclst , Map<Id , Account> OldMapAcc)
     {
         for(account acc: acclst)
         {
             if(acc.phone != OldMapAcc.get(acc.Id).phone)
             {
                 acc.Description = 'phone field is updated old value is: '+OldMapAcc.get(acc.Id).phone+ ' and NEW value is : '+acc.phone;
                 
             }
         } 
  
     }

//if we change the rating of account hot to warm 
// than one opportunity will be created  
  
    public static void createoppWhenRatingChangedFromHotTOWarm(Map<id,Account>NewMAplst, Map<id,Account>OldMAplst)
      {
           list<opportunity> opplst = new list<opportunity>();
          
            for(account acc : newMaplst.values())
            {
                if(newmaplst.get(acc.Id).Rating != oldmaplst.get(acc.Id).rating
                          && newmaplst.get(acc.Id).Rating =='warm')
                    
                     {
                         opportunity oppObj = new Opportunity();
                         oppObj.accountID = acc.Id;
                         oppObj.Name = acc.Name;
                         oppObj.StageName= 'prospecting';
                         oppObj.CloseDate = system.today();
                         
                         opplst.add(oppObj);
                     }
            }
          
          insert opplst;
          
      }
        
}