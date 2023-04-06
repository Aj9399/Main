public class accountsanjayguptatriggerhandler {
    
    public static void updateRating(list<account>  acclst)
    {
        for(account acc : acclst) {
            
            if(acc.Industry != null && acc.Industry == 'MEDIA'){
                acc.Rating = 'HOT';
            }
        }
    }
    
    
    public static void createRelatedrec(list<account> newacclst)
    {
        list <opportunity> opplst = new list <opportunity>();
        for(account acc : newacclst)
        { 
         opportunity opp = new opportunity();
            opp.NAme = acc.Name;
            opp.AccountID = acc.ID;
            opp.stagename = 'Prospecting';
            opp.closeDate = system.today();
            opplst.add(opp);
            
        }
        if(!opplst.isempty()){
            insert opplst;
        }
    }
    
    public static void updatePhoneDescription(List<account> newlist , Map<ID,Account> oldMap)
    {
        for(account acc : newlist){
            
            if(oldMap!= Null && acc.phone != oldMap.get(acc.ID).phone){
                acc.Description = 'phone number is updated';
                
            }
        }
    }
}