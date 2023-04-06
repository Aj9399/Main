public with sharing class googleDrive {
    public googleDrive() {
       
       
        import com.google.gson.Gson;
        import com.google.gson.JsonObject;
        import com.google.gson.JsonParser;
        import com.google.gson.JsonSyntaxException;
        import com.google.gson.annotations.SerializedName;
        import system.Http;
        import system.HttpRequest;
        import system.HttpResponse;
        import system.JSON;
        import system.URL;

        public static String uploadToDrive(String fileName, String mimeType, String fileContent, String accessToken, String folderId) {
            // Your code here

            HttpRequest request = new HttpRequest();
            request.setMethod('POST');
            request.setEndpoint('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
            request.setHeader('Authorization', 'Bearer ' + accessToken);
            request.setHeader('Content-Type', 'multipart/related; boundary=END_OF_PART');
            request.setBodyAsBlob(createMultipartBody(fileName, mimeType, fileContent, folderId));


            HttpResponse response = new Http().send(request);

            
            
            String responseBody = response.getBody();
            JsonObject jsonResponse = new JsonParser().parse(responseBody).getAsJsonObject();
             String fileId = jsonResponse.get("id").getAsString();



        }


        private static Blob createMultipartBody(String fileName, String mimeType, String fileContent, String folderId) {
            // Your code here

            String boundary = 'END_OF_PART';
            
            String metadata = createMetadataPart(fileName, mimeType, folderId);
            String file = createFilePart(fileContent);
            String body = '--' + boundary + '\r\n' + metadata + '\r\n' + file + '\r\n--' + boundary + '--';
           
            return Blob.valueOf(body);





        }



        
        
        private static String createMetadataPart(String fileName, String mimeType, String folderId) {
            String metadata = '--END_OF_PART\r\n';
            metadata += 'Content-Type: application/json; charset=UTF-8\r\n\r\n';
            metadata += '{\r\n';
            metadata += '  "name": "' + fileName + '",\r\n';
            metadata += '  "mimeType": "' + mimeType + '",\r\n';
            metadata += '  "parents": ["' + folderId + '"]\r\n';
            metadata += '}\r\n';
            return metadata;
        }
       
        





        private static String createFilePart(String fileContent) {
            String file = '--END_OF_PART\r\n';
            file += 'Content-Type: '
        
        
        

    }
}