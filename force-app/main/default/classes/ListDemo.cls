public class ListDemo {
    public static void ListMethod(){
        List<String> strlst = new List<String>();
        List<String> strlst2 = new List<String>();
        Set<String> strset = new set<string>();
        
        Boolean Res ;//for checking Contain method and equal method;
        
        sObject sObj = [SELECT ID , NAME from ACCOUNT LIMIT 1];
       
        
        strlst.add('kaushal');
        strlst.add('himanshu');
        strlst.add(0,'India');
  
        
        strlst2.add('XXXen');
        strlst2.add('you');
        
        Res = strlst.Contains('india');
        system.debug(''+Res);               // in that case it is FALSE & if it is India wih capital I than it will reurn TRUE:
        
        strlst2.addAll(strlst);                         // here we can add elements which are in strlst 
        
         strset.add('Japan');
        
        strlst2.addAll(strset);                         //  here we add values  or element from set to a list
        
        
       
        
     
        // system.debug(''+strlst);                                result will be (india ,kaushal,himanshu )
       
        //system.debug(''+strlst2);                               result will be (xxxen,you, india ,kaushal,himanshu )
        
          // system.debug('Object Type ='+Sobj.getsObjectType());                  we can get SsObject type:  
           
           //    system.debug(''+strlst2.Indexof('India'));             we can get the value of index in strlst2:
              
           //    system.debug(''+strlst.sort());                       that will not work for sort()MEthod 
          
    }

}