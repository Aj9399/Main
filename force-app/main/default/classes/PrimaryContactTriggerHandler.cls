public class PrimaryContactTriggerHandler 
{
    public static void RestrictMoreThanONEprimaryContact(list<Contact> conlist)
    {
        
        set<String> AccountIds = new Set<string>(); 
        
        Map<id,contact> AccountidContactMAp = new Map<id ,contact>();  //existing primary contact for each Account in MAP.
        
        
        
        
        // here we got contact accountIDs with checkbox as true.
           for(contact conObj : conlist)
          {
              if(conObj.AccountId != Null && conObj.PrimaryContact__c == true)    
              {
                 AccountIds.add(conObj.AccountID);                        
              }
      
          } 
               // for map preparation 
             list<contact> conDetails = [SELECT ID , LastName ,PrimaryContact__c , AccountID from Contact 
                                         where AccountId IN :AccountIds AND PrimaryContact__c = true ];
      
       
       
         if( AccountIds != Null && AccountIDs.size()>0)
           {
               for (contact cons :conDetails)
               {
                   AccountidContactMAp.put(cons.AccountId, cons);
               }
           }
        
        //validation start from here
        
        for(contact conObj :conlist)
        {
            if(conObj.PrimaryContact__c == true && conObj.AccountId != Null 
                 && AccountidContactMAp.get(conObj.AccountId) != Null )
                
               {
                conObj.addError('you cannot create more than one primary contact');   
               }
        }
        
    }
    
    //prevent user for having multiple primary contacts under an account in update
     
    public static void PreventPrimaryContactOnUpdate(Map<id , contact> contactNewMap , Map<id , contact> contactOldMap)
    {
         set<String> AccountIdSet = new Set<string>();
        
        Map<id,contact> AccountidContactMAp = new Map<id ,contact>();
        
        
        
        for(contact con : contactNewMap.values())
         {
             if(contactNewMap.get(con.Id).PrimaryContact__c != contactOldMap.get(con.ID).PrimaryContact__c
               && contactNewMap.get(con.Id).PrimaryContact__c == true &&  con.AccountId != Null) 
             {
                 AccountIdSet.add(contactNewMap.get(con.Id).AccountID);
             }
         }
        
         list<contact> conDetails = [SELECT ID , LastName ,PrimaryContact__c , AccountID from Contact 
                                         where AccountId IN :AccountIdSet AND PrimaryContact__c = true ];
        
        
           for(contact cons :conDetails)
           {
              AccountidContactMAp.put(cons.AccountId, cons);
           }
        
        for(contact con : contactNewMap.values())
          {
              if(contactNewMap.get(con.Id).PrimaryContact__c != contactOldMap.get(con.ID).PrimaryContact__c
                 && contactNewMap.get(con.Id).PrimaryContact__c == true 
                 &&  contactNewMap.get(con.id).AccountId != Null
                &&  AccountidContactMAp.get(contactNewMap.get(con.Id).AccountID)!= Null )
                 {
                     con.addError('You cannot make more than one primary contact');
                 }
          }
    }
    
  
}