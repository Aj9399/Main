public class MyApexClass

{
    @AuraEnabled(cacheable=True)
    public static void uploadFilesWithAccessToken(Id recordId ) 
    
    {
              // Retrieve the access token from a custom metadata field
      
        Google_API_Details__mdt metadata = [SELECT Access_Token__c FROM Google_API_Details__mdt ];
        
        String accessToken = metadata.Access_Token__c;
        
                // Retrieve the file data for the record
        
        List<ContentDocumentLink> contentDocumentLinks = SalesforceFilesHelper.getContentDocumentLinks(recordId);
        
        Map<String, Blob> fileDataMap = SalesforceFilesHelper.getFileDataMap(contentDocumentLinks);
        
               // Construct the HTTP request
      
        
        String endpoint = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('POST');
        req.setHeader('Authorization', 'Bearer ' + accessToken);
        req.setHeader('Content-Type', 'multipart/related; boundary=MyBoundaryString');
        
               
        
               // Construct the multipart request body
        
        
        String body = '';
        
        for (String fileName : fileDataMap.keySet())
         {
            
            String fileContentType = SalesforceFilesHelper.getContentType(fileName.substringAfterLast('.'));
           
            String fileContent = EncodingUtil.base64Encode(fileDataMap.get(fileName));
            
            body += '--MyBoundaryString\r\n';
            body += 'Content-Type: application/json; charset=UTF-8\r\n\r\n';
            body += '{ "name" : "' + fileName + '" }\r\n';
            body += '--MyBoundaryString\r\n';
            body += 'Content-Type: ' + fileContentType + '\r\n';
            body += 'Content-Transfer-Encoding: base64\r\n\r\n';
            body += fileContent + '\r\n';
        }
        
        
        body += '--MyBoundaryString--\r\n';
        
        req.setBody(body);
        
                                                                                                    // Send the HTTP request
       
         Http http = new Http();

         HttpResponse res = http.send(req);
        
     
                                                                                                        // Check the response for errors
       
      // Check the response for errors
             
        String fileId = extractFileIdFromResponse(res.getBody());
        
        if (res.getStatusCode() == 200 && fileId != null ) 
        {
         System.debug('File uploaded successfully with ID: ' + fileId);
        }
        else 
        {
            System.debug('Error uploading files: ' + res.getBody());
        }
    }
    
    
    
     // Helper method to extract the file ID from the response body
  
    private static String extractFileIdFromResponse(String responseBody)
    {
        JSONParser parser = JSON.createParser(responseBody);
        
        while (parser.nextToken() != null)
        {
            if ((parser.getCurrentToken() == JSONToken.FIELD_NAME) && (parser.getText() == 'id')) 
            {
                parser.nextToken();
                return parser.getText();
            }
        }
        return null;
    }

}