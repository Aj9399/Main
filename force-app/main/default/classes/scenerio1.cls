public class scenerio1 
{
    public static void updateRelatedRec(List<account> acclst)
    {
        list<contact> con = new list<contact>();
        for(account acc : acclst)
        {
            contact c = new Contact();
            
            c.accountid= acc.Id;
            c.LastName = acc.Name;
            con.add(c);
            
        }
        Insert Con;
    }
    
    public static void annualRevenueHandler(list<account> acclst)
    {
        For(Account acc: Acclst)
        {
            if(acc.AnnualRevenue < 1000)
            {
                acc.AnnualRevenue.adderror('Annual Revenue can not be less than 1000');
            }
        }
        
    }
    public static void restrictDuplicacy(list<account> acclst)//existing account name in set than new name in set than compare both
    { 
        set<string> str = new set<string>();
        set<string> strold = new set<string>();
          
        for(account acc : acclst)
        {
           str.add(acc.name); 
        }
        list<account> accl = [SELECT ID , NAME FROM ACCOUNT WHERE NAME IN : Str];
        
        for(account acc: accl)
        {
          strold.add(acc.name);  
        }
        
        for(account acc : acclst)
        {
            if(strold.contains(acc.name))
            {
                acc.name.Adderror('account name already exists');
            }
        }
    }
}