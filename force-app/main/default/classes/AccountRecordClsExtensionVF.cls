public class AccountRecordClsExtensionVF {
    public list <Account> acclist{get;set;}

    public AccountRecordClsExtensionVF(ApexPages.standardController accrec){
        acclist = new List<Account>();
        acclist = [Select id , Name , type , rating from Account limit 10];
    }
}