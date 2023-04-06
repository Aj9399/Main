global class GoogleDriveAccessTokenSchedulerr implements Schedulable {

    global void execute(SchedulableContext SC) 
    {
            
        GdriveBatchClass batch = new GdriveBatchClass();
        Database.executeBatch(batch);

  }
    
    
    
   public static void scheduleJob() {
   
    GoogleDriveAccessTokenSchedulerr GD1 =  new GoogleDriveAccessTokenSchedulerr();
       
       String cronString1 = '0 0 * * * ?';
       System.schedule('GoogleDriveAccessTokenJob1', cronString1, GD1);
       
       
      
        GoogleDriveAccessTokenSchedulerr GD2 =  new GoogleDriveAccessTokenSchedulerr();
       
       String cronString2 = '0 5 * * * ?';

       System.schedule('GoogleDriveAccessTokennewJob2', cronString2, GD2);
       
       GoogleDriveAccessTokenSchedulerr GD3 =  new GoogleDriveAccessTokenSchedulerr();
       
       String cronString3 = '0 10 * * * ?';

       System.schedule('GoogleDriveAccessTokennewJob3', cronString3, GD3);   
       
       
        GoogleDriveAccessTokenSchedulerr GD4 =  new GoogleDriveAccessTokenSchedulerr();
       
       String cronString4 = '0 15 * * * ?';

       System.schedule('GoogleDriveAccessTokenJob4', cronString4, GD4);
       
       
       
        GoogleDriveAccessTokenSchedulerr GD5 =  new GoogleDriveAccessTokenSchedulerr();
       
       String cronString5 = '0 30 * * * ?';

       System.schedule('GoogleDriveAccessTokenJob5', cronString5, GD5);
       
       
       
       GoogleDriveAccessTokenSchedulerr GD6 =  new GoogleDriveAccessTokenSchedulerr();
       
       String cronString6 = '0 50 * * * ?';

       System.schedule('GoogleDriveAccessTokenJob6', cronString6, GD6);
       
}

}