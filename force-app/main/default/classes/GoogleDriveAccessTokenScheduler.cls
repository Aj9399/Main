global class GoogleDriveAccessTokenScheduler implements Schedulable {

    global void execute(SchedulableContext SC) 
    {

                                                                                     
                                                                                      
        
        String refreshToken = '1//04OhTVx0r_W2fCgYIARAAGAQSNwF-L9Ir9rGGOh2ilszzMaCi6VOmdauqkPLqphiERx6VlYTRQS7wbUTFcFw0o0QFxy1hjpTFkik';
        
        String clientId = '213192145039-qhit6ns8lsesi3fo9175prnhadloqjob.apps.googleusercontent.com';
        
        String clientSecret = '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';
        
        String tokenEndpoint = 'https://oauth2.googleapis.com/token';

                                                                                // Construct the HTTP request to get the access token
   
                                                                                     //https://oauth2.googleapis.com/token
        
        HttpRequest request = new HttpRequest();
        
        request.setEndpoint(tokenEndpoint);
        
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        request.setBody('grant_type=refresh_token &refresh_token=' + refreshToken + 
                        '&client_id=' + clientId + '&client_secret=' + clientSecret);

                                                                                                     // Send the HTTP request and get the response
        Http http = new Http();
        HttpResponse response = http.send(request);

                                                                                            // Parse the response and get the access token
         
        String accessToken = null;
        if (response.getStatusCode() == 200) 
        {
            Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            
            accessToken = (String) responseMap.get('access_token');
            
                                                                         
            
            
          //  MetadataUtility.upsertRecord(accessToken);                                      
            
      
        } else {
            System.debug('Error getting access token: ' + response.getBody());
               }
        
  }
    
    
    
   public static String scheduleJobtest() {
    String jobName = 'GoogleDriveAccessTokenJob';
    String cronString ;
     
      cronString='0 5 * * * ?';
      cronString='0 10 * * * ?';
      cronString='0 15 * * * ?';
      cronString='0 20 * * * ?';
      cronString='0 25 * * * ?';
      cronString='0 30 * * * ?';
      cronString='0 35 * * * ?';
      cronString='0 40 * * * ?'; 
      cronString='0 45 * * * ?';
      cronString='0 50 * * * ?';
      cronString='0 55 * * * ?';
      cronString='0 00 * * * ?';

    System.schedule(jobName, cronString, new GoogleDriveAccessTokenScheduler());
    return jobName;
}

}