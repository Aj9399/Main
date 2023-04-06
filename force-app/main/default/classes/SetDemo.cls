public class SetDemo {
    public static void setMethod()
    {
        Set<String> strSet = new Set<String>();
        list<String> strlst = new list<string>{'MP','Up'};
        Set<string> strSet2 = new set<String>();
             
            
        strSet2.add('yoo');
        strSet.add('India');
        strSet.add('aust');
        
        //boolean b;
       // b = strSet.Contains('aust');
        
        system.debug(strset.contains('aust'));
                     
                     //or we can do system.debug(strset.contains('aust'));
        
        
          // strSet2 = strSet.clone();
         //system.debug(strSet2); in clone there is one is problem result is {india , aust},not showing yoo{strset2}elements      
         
           //strSet.addAll(strlst); //addAll method used to add list elements ;as well as to add set elements
           
          //system.debug('strSet= '+strSet);
         //    strset.clear();
        
       // system.debug('strSet= '+strSet);   // here result will be (mp,up,india,aust)
    }
}