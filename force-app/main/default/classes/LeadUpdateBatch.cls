global class LeadUpdateBatch implements Database.batchable<sObject>
{

//when we want to execute any code on millions of records than we use batch apex/class which do execution on records in batches or chunks   
//here    Database.Batchable is an interface which makes our class as batch class
//in batch there is 3 mwthods 

//start :  basically here we fetch the record on which we want to  execute the particular operation
//      :  collects the records or objects to pass to the interface method
//      :  this is the first method which is called  when we execute a batch apex 
//      :  it return a database.queryLocator object that contain  the record 
//execute :in execute we write our main executable code and it will perform many times in term of batch/chunks 
//finsh  :  here we do some post processing things like send an email after method will be executed
//

    global Database.QueryLocator Start(Database.batchableContext bc)
    {
        return database.getquerylocator([Select AnnualRevenue from lead]);
    }
                                //Execute : use the execute method to do the required processing of each chunk/batch of data
                                //         : this method is called  for each batch of record that you  pass through
  
    global void execute(Database.batchablecontext bc , list<lead> lList)
    {
        for(lead l : lList)
        {
            l.annualrevenue = 3000000; 
            
        }
        update lList;
    }
    global void Finish(database.batchablecontext bc )
    {
       //to send an email using code 
        Messaging.SingleEmailmessage mail = New  Messaging.SingleEmailmessage();
        String[] toAdresses = new String[]{'ajaydixit754@gmail.com'};
        mail.setToAddresses(toadresses);
        mail.setSubject('hey its done');
        mail.setPlainTextBody('heyy i m gud what about you');
        Messaging.sendEmail(NEW Messaging.SingleEmailmessage[]{mail});
    }
}