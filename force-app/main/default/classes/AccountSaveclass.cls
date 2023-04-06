public class AccountSaveclass {
    public Account actObj{get;set;}               //in this method , there is actObj{get;set;} --> it is a property
    
    public AccountSaveclass(){                    // and here we are initializing with new Account().
        
        actObj = new Account();
    }
    
    public pagereference saveAccount(){            // saveAccount is my action which we used in our visualforce.
        insert actObj;           
        return new pagereference('/'+actObj.Id);   //basically this ('/')->refers to base url of our salesforce org,
                                                   //and actObj.Id --> refers to the id 
    }

}