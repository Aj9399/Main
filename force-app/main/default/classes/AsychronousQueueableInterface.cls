/*       Queueable : similar to future method, Queueable is also a set of code that we runs in Background.
 *               
 *               future is just a method but queueable is a class and we need to add our code inside execute method 
 *                      which is in sub class and that has to implements queueable class.
 *      
 *      How to call Queueable class:                 benefits over future method:
 *   system.enqueueJob(new myclass());              1)queueable alllows chaining of Jobs unlike future Method.    
 *                                       by writing this in existing Job inside execute method = system.enqueueJob(new myclass());.
 *                                                
 *                                                  2)Getting an ID for your Job 
 *                                    this id will help us to monitor our queueable job progress
 *                                            string jobID = System.enqueuejob(new job1());
 *                                                        system.debug(' ' +jobID). all this in anonymous window
 *                                                                                          
                                                     3)queueable allows using non primitive types as parameters(sObjects)


   Account(shreekant)------->trigger------->queueableClass contact(shreekant)
 here we are inserting one record in account so the trigger will call and form triiger we want to call our queueable class 
  on contact

*/
   
    public class AsychronousQueueableInterface implements Queueable
{
    public void Execute(Queueablecontext qcntx)
        
    {//write your logic that need to run in background 
        
       DELETE[SELECT iD from lead WHERE CreatedDate = Last_year];
        
        //here we can chain any job if we want
        
    }
     
}