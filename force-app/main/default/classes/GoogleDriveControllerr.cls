public with sharing class GoogleDriveControllerr
{
 
  private static final String CLIENT_ID = '809140556232-ggfbr7m9q86u777mh9b285gn803ndqiv.apps.googleusercontent.com';
  private static final String CLIENT_SECRET = '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';
  private static final String REDIRECT_URI = 'https://localhost';
  private static final String AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/auth';
  private static final String TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

 
    
     
  @AuraEnabled
  public static String buildAuthorizationUrl() 
  
  {
   
    String state = EncodingUtil.urlEncode('some_random_state', 'UTF-8');
    String scope = EncodingUtil.urlEncode('https://www.googleapis.com/auth/drive.file', 'UTF-8');
    String responseType = EncodingUtil.urlEncode('code', 'UTF-8');
      
    String authUrl = AUTH_ENDPOINT
        
                   + '?response_type=' + responseType
                   + '&client_id=' + CLIENT_ID
                   + '&redirect_uri=' + REDIRECT_URI
                   + '&scope=' + scope
                   + '&state=' + state;
      
    return authUrl;
      
      // return new PageReference(authUrl).getUrl();
  
  }
    

    
    
  @AuraEnabled

    public static String getAccessToken(String code)

  { 
           //code = ApexPages.currentPage().getParameter().get('code'); 
      
    HttpRequest request = new HttpRequest();  //https://oauth2.googleapis.com/token?code=4%2F0AWtgzh41E44JJPn8SRJ58Qq8rkA-jywUoU0ZU7IccYy2mxVjapwo-f4R6B0c2F8fc9i6jg&grant_type=authorization_code&redirect_uri=https//:localhost&client_id=967118658185-bb5clbfrnojl9p6d5fnpllp5dh4pg2fg.apps.googleusercontent.com&client_secret=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
    request.setMethod('POST');
    request.setEndpoint(TOKEN_ENDPOINT);
      
    String requestBody = 'code=' + EncodingUtil.urlEncode(code, 'UTF-8')
                       + '&grant_type=authorization_code'
                       + '&redirect_uri=' + EncodingUtil.urlEncode(REDIRECT_URI, 'UTF-8')
                       + '&client_id=' + CLIENT_ID
                       + '&client_secret=' + CLIENT_SECRET;
      
    request.setBody(requestBody);
      
      
    Http http = new Http();
      
    HTTPResponse response = http.send(request);
      
    system.debug('response '+response.getStatusCode());
    system.debug('response body '+ response.getBody());
      
      
    if (response.getStatusCode() == 200) 
        
    {
      Map<String, Object> tokenInfo = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
        
      String accessToken = (String) tokenInfo.get('access_token');
        
        
      return accessToken;
  }
      
   
   else {
    // Handle the error case here
    Map<String, Object> errorInfo = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
    String error = (String) errorInfo.get('error');
    String errorDescription = (String) errorInfo.get('error_description');
    String errorMessage = 'Error while getting access token from Google Drive API. Error: ' + error + ', Error Description: ' + errorDescription;
    System.debug(errorMessage);
    throw new AuraHandledException(errorMessage);
}

  }
}