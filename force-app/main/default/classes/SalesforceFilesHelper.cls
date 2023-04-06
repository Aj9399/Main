public with sharing class SalesforceFilesHelper 
{
    
                                                                   // Returns the file data for the given ContentDocumentLinks. 
    
     
    public static Map<String, Blob> getFileDataMap(List<ContentDocumentLink> contentDocumentLinks)
    
    {
        Map<String, Blob> fileDataMap = new Map<String, Blob>();
       
        for (ContentDocumentLink cdl : contentDocumentLinks)
        
        {
            ContentDocument contentDocument = [SELECT Id, Title, FileType, FileExtension,ContentSize, LatestPublishedVersionId
                                                 FROM ContentDocument WHERE Id = :cdl.ContentDocumentId];
            
            ContentVersion contentVersion = [SELECT Id, VersionData, FileType FROM ContentVersion WHERE Id = :contentDocument.LatestPublishedVersionId];
             
         
            fileDataMap.put(contentDocument.Title + contentDocument.FileExtension, contentVersion.VersionData);
        }
     
        return fileDataMap;
    }

     
               
              // Returns the original file name for the given ContentDocumentLinks.
      
    
    public static Map<String, String> getOriginalFileNameMap(List<ContentDocumentLink> contentDocumentLinks)
    
    {
        Map<String, String> originalFileNameMap = new Map<String, String>();
       
        for (ContentDocumentLink cdl : contentDocumentLinks)
        
        {
        
            ContentDocument contentDocument = [SELECT Id, Title, FileExtension  FROM ContentDocument WHERE Id = :cdl.ContentDocumentId];
           
            originalFileNameMap.put(contentDocument.Title + contentDocument.FileExtension, contentDocument.Title);
        
        }	
        
        return originalFileNameMap;
    }

    
               // Returns the content type for the given file extension.
     
   
    
    public static String getContentType(String fileExtension) 
    
    {
        if (fileExtension == '.pdf')
        {
            return 'application/pdf';
        }
        else 
            if (fileExtension == '.jpg' || fileExtension == '.jpeg')
        {
            return 'image/jpeg';
        } 
        else
            if (fileExtension == '.png')
        {
            return 'image/png';
        } 
        else 
            if (fileExtension == '.txt')
        {
            return 'text/plain';
        } 
        else {
            return 'application/octet-stream';
        }
    }
    
    
                     //  Returns the ContentDocumentLinks for the given record Id.
     
    public static List<ContentDocumentLink> getContentDocumentLinks(Id recordId) 
    {
        return [SELECT Id, ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId];
    }
}