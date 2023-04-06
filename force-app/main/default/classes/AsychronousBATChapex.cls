/*BAtchApex  =   when we want to execute any code on millions of records than we use batch apex/class 
 *                 which do execution on records,  in chunks/batches .
 *       
 *        Implements Database.batchable() = this is a batch class.
 * 
 *       database.batchable is an interface , interface is something like 'to do list'.
 * 
 *  there is 3 types of method in batch apex(or three types of to do list start, execute , finish)
 *  1) START()   = query all the records to process. 
 *  2) Execute() =  process batch of records from start .
 *  3) Finish()  = any post processing logic eg: send email.   
 * 
 *    Batch size = Minimum is more than 0,                 major benefits over others:
 *                 Maximum can be 2000,         1) it allow you to process 50 millions of records  in background
 *                 default will be 200,         2) Best for long running process            
 *                                              3) Batch apex allows chaining of jobs like queueable class
 *                                                 write Database.execute(new SecondBatch()); 
 *                                                 in first batchJob Finish Method.    
 * 
 * 
 *         Batch apex Limitations :
 *  1) can have only 5 batch jobs running at a time.
 *  2) Future methods can not be called from Batch apex
 * 
 *               

         NOTE : how  can be call Batchable 
                Database.executeBatch(new MyclassName(),2000) , here 2000 is my batch size


*/

  public class AsychronousBATChapex implements Database.Batchable<sObject> 
{
    
      public database.Querylocator Start(Database.batchableContext bc)
      {  // 1 million -- 2000 records to execute
          
        Return Database.getQuerylocator('SELECT ID , name from Account'); //it will not hit exception even the query return 1M of records 
      }
    
      public void Execute(DAtabase.BatchableContext bc , list<account> sublistFromStartMethod)
      {   //logic to process 2000 records
          For(Account acc: sublistFromStartMethod)
          { 
            acc.NAme = 'BAtch updated - '+acc.name; 
          }
          update sublistFromStartMethod;
      }
    
      public void Finish(Database.batchableContext bc )
      { // post process logics 
          system.debug('hey  my job is completed ');
        
      }
}