public class Myclass {
    public static List<String> Mymethod(){
        system.debug('heyyy');
        
        List<account> acc = [select Id , Name from Account];
        
        List<String> l = new List<String>();
        
        for(Account accc : acc){
            l.add(accc.Name);
        }
        system.debug(l);
        
        return l;
    }    
}