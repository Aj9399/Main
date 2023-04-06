public class MapSceneriotriggerhandler 
{
    public static void byusingMAPupdateRelatedContact(list<account>acclst , Map<Id,account> OldMaplist)
    {
        MAP<Id, Account> acctoAccountMap = new MAP<Id , Account>();
        
        for(account acc :acclst)
        {
            if(acc.phone != null && acc.phone != OldMaplist.get(acc.id).phone)
            {
                acctoAccountMap.put(acc.Id,acc);
            }
        }
        
        
        




        
    }

}