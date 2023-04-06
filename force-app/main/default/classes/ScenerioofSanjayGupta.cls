public class ScenerioofSanjayGupta
{
     public static void AccCheckboxHAndler(list <account> acclst)
     {
         list<contact> conlst = new list <contact>();
         list<opportunity> opplst = new list <opportunity>();
         
         for(account acc : acclst )
         {        
             //contact
             if(acc.NewContact__c)
             {
                 contact con = new contact();
                  con.AccountID =acc.ID;
                  con.lastNAme = acc.name;
                  con.Firstname = 'test';
                  conlst.add(con);
              }

             //opportunity
             if(acc.NewOpportunity__c )
             {
                 
                   opportunity opp = new opportunity();
   
                     opp.name = 'opp test ' + acc.NAme;
                     opp.StageName = 'ClosedWon';
                     opp.AccountId = acc.ID;
                     opp.CloseDate = system.today();
                     opplst.add(opp);
  
                }
         }
         
         if(!conlst.isEmpty())
         {
             insert conlst;
         }
         if(!opplst.isEmpty())
         {
             insert opplst;
         }
   
     }
    
    //when account phone field is updated than populated below message in description field
    //phone is updated && Old value is XXXX & New VAalue is XXXX
    
    
        public static void updateAccDescOnPhoneUpdate(list<account> acclst , MAp<ID , ACCOUNT >oldACCMap)
        {
            for(account acc : acclst)
            {
                if(acc.phone != OldAccmap.get(acc.id).phone)
                {
                    acc.Description = 'Phone IS Updated! old value = ' +OldAccmap.get(acc.id).phone+
                                             ' and snew value is = ' +acc.phone;
                    
                } 
            }
        }
}