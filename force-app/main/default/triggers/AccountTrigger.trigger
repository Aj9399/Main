trigger AccountTrigger on Account (before insert , after insert , before update ) {
     //CONTEXT variable -- (values which developer needs to write logic)
     //CONTEXT variable 1 : Trigger.new --> LIST of records that are got inserted / update
    //CONTEXT variable  2  : trigger.isBefore 
    //CONTEXT variable  3  : trigger.isInsert
    //CONTEXT variable  4  :trigger.old  --> store old values of that same record  
      
      If(trigger.isafter && trigger.isupdate){
          
          for(Account accRecNew : trigger.new){
              account accRecold = trigger.oldMap.get(accRecNew.Id);
              
              IF(accRecNew.billingaddress != accRecOld.billingaddress){
                  
              }
              
          }
      }
      
      
      
      
      
      
      
      
      if(trigger.isbefore && trigger.isupdate){        // scenerio 4 : BEFORE UPDATE LOGIC 
                                                          //THROW ERROR IF ACCOUNT NAME IS CHANGED/MODIFIED
          
          for(account accRecNew : trigger.new)
              
            {account accRecOld=  trigger.oldMap.get(accRecNew.id);
            if(accRecOld.NAME != accRecNew.NAME){
                 accRecNew.addError('Account name can not be modified once it is created');
           }
              
          }
      }
      
      
      
      
      if(trigger.isAfter && trigger.isInsert){    //  scenerio 3 : AFTER INSERT LOGIC
          
         list<contact> conlst = new list<contact>();
          
        for (account acc2 : Trigger.new)
              
          { contact con = new contact();
            con.lastname = acc2.Name;
            con.accountId = acc2.ID;
              conlst.add(con);
           }
          
          if (conlst.size() > 0)
              INSERT conlst;
      }
      
      

      
     If (trigger.isbefore && trigger.isinsert){
          
       for(Account accRec : Trigger.new){

                                                         //Scenerio 2 : Throw an error if  annual revenue is greater than 1000
     If(accRec.AnnualRevenue < 1000)
                  
           accRec.addError('annual revenue cannot be less than 1000');
    
              
              //Scenerio 1 ;
             
     If(accRec.Shippingcity == null)
               
           accRec.shippingcity = accRec.billingcity;
          }
      }                    //NEVER WRITE INSERT/UPDATE STATEMENT IN BEFORE EVENTS 

}