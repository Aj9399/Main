@isTest
   // we are writing test class for trigger in their Handler
public class accountTriggerHandlerTest {
    @isTest
    public static void copyBillingaddresstoShippingInsertTest()
    { //bulkifying
        list<account> acclst = new list <account>();
        for(Integer i = 0 ; i<2; i++){
          
        account acc = new account();
        acc.name = 'test '+ i;
        acc.Billingcity = 'testCOUNTRY';
        acc.billingstate = 'TestState';
          acclst.add(acc);  
        }
        Test.startTest();
        Insert acclst;  // so upon writing insert , trigger will calling automatically
        Test.stopTest();
        account updatedAcc = [SELECT Shippingcity from Account WHERE ID =: acclst[0].ID ];
        //system.assertEquals(NULL, acc.shippingCity);
    }
}