@isTest
public class ScenerioofSanjayGuptatest
{     @isTest
      public static void createConORoPP()
    {
         list<account> acclst = new list <account>();
         
         
     
         for(Integer i=1; i<10 ; i++ )
         {account acc = new account();
           acc.Name = 'test '+i;
          if(MAth.mod(i, 2) == 0)
              
          { acc.NewContact__c = true;}
          else
              
          {acc.NewOpportunity__c = true;}
          acclst.add(acc);
         }
        
        //Insert Data
        test.StartTest();
        insert acclst;
        Test.StopTest();
        
        //list<contact> conlst = [SELECT ID FROM CONTACT WHERE ACCOUNTId =: acclst.[1].id];
        
      //  list<opportunity> opplst = [SELECT ID FROM opportunity WHERE ACCOUNTId =: acclst.[0].id];
    }
}