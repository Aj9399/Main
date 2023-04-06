public with sharing class MetadataUtility {
  

    public static void upsertRecord(string accessToken){
                                                                                      
      
         //fetch records
   
           
       List<Google_API_Details__mdt> metaList = 
      
       [Select MasterLabel, DeveloperName, Access_token__c From Google_API_Details__mdt];
       
        
        system.debug(metalist);
        
       
       //instance of the record
       
      
       
       Metadata.CustomMetadata mdata = new Metadata.CustomMetadata();
        
       mdata.fullName = 'Google_API_Details__mdt.'+Metalist[0].DeveloperName;
        
       mdata.label = Metalist[0].MasterLabel;
        
        system.debug(mdata);
       
       
        
        
        //instance of the value
       
       
       Metadata.CustomMetadataValue instance = new Metadata.CustomMetadataValue();
        
       instance.field = 'Access_Token__c';
       instance.value = accessToken;
       
       
        
       //adding the value to the record
       
       mdata.values.add(instance);
       
        
       
      
       //instance of the container
     
        Metadata.DeployContainer container = new Metadata.DeployContainer();
        system.debug(container);
        
       container.addMetadata(mdata);
        
        
        system.debug(container);
        
       
       //enqueue deployment to the salesforce org
       
       Metadata.Operations.enqueueDeployment(container, null);
        system.debug(container);
        
        
       
    }
}