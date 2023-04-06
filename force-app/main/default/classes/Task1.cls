public class Task1 {
    @InvocableMethod
    public static void myMethod(){
        
        List<Id> idList = new List<Id>();
        List<Opportunity> opp = [select id, name, stagename from Opportunity where StageName = 'Closed Won'];
        for(Opportunity oo : opp){
            idList.add(oo.Id);
        }
        
        List<Stage_Closed__c> s = [select Id, Opportunity__c from Stage_Closed__c where Opportunity__c IN : idList];
        delete s;
        
    }

}