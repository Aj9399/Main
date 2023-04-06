public class DemoSObject {
    public static void demomethod()
    {
      list<Account> acclst = new list<Account>();
        list<String> strlst = new list<String>();
       
        Set<ID> accid = new Set <ID> ();
        acclst = [SELECT id , NAME from Account];   // here if  we did not write ID but it will get printed automatically
          
        
        IF (!acclst.isEmpty())    // if acclst is not empty than loop will activate; first we check whether the lst is empty or not;
                                   // using list in for loop
        {
             For(Account acc : acclst)
             {strlst.add(acc.name);            // here list, set, map variable name . add(value) //strlst.add(acc.name); 
              system.debug(''+ strlst[0]);
             }      
             }    
   } 
}