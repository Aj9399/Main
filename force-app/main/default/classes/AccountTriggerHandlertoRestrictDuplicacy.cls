public class AccountTriggerHandlertoRestrictDuplicacy {
    
    //scenerio - we have to restrict duplicate account name by giving error 
   
    public static void restrictDuplicacyOnAcc(List<account> newAcclst )//newAcclst contains values we are inserting / updating 
    {
       set<string> accNameset = new set <string>();
       set<string> accsetExistingName = new set <string>();
        
        for(account acc : newAcclst )
        
        {accNameSet.add(acc.NAME);  //add new names into sets
            
        }
         list<account> existingNAME = [select ID, NAME from account where NAME IN: accNameSet ];//existing records 
        
        for(account acc : existingNAME)
        {
           accsetExistingName.add(acc.NAME); // existing name in this set
        }
        
        
        for(account newRec : newacclst ) {
            if (accsetExistingName.contains(newRec.NAME))
            {
                newRec.NAME.adderror(' account NAME already exists ');
            }
            
            else
                
            {
                accsetExistingName.add(newRec.NAme);
            }
        }     
    }
    //we have to restrict dulicacy on phone before insert as well as before update
   
    public static void restrictDuplicacyonAccphone(list<account> acclst){
        
        set<string> contct  = new Set<string>();
        set<string> contctexist  = new Set<string>();
        
        for(account acc : acclst){
            contct.add(acc.phone);
        }
        
        list<account> lst = [SELECT ID , NAME , PHONE FROM ACCOUNT WHERE PHONE IN :CONTCT];
        
        FOR(account acc : lst){
            contctexist.add(acc.phone);
        }
        for(account acc : acclst){
            if(contctexist.contains(acc.phone)){
                acc.Phone.addError('Phone no. is already registered ');
            }
            else
        {contctexist.add(acc.phone);
        }
        
            
        }
    }

}