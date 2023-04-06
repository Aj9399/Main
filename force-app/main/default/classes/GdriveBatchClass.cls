global class GdriveBatchClass implements Database.Batchable<sobject>,Database.AllowsCallouts , Database.stateful {
        
        global Database.QueryLocator start(Database.BatchableContext BC)
        {
            String query ='Select MasterLabel, DeveloperName, Access_token__c  From Google_API_Details__mdt';
            return Database.getQueryLocator(query);
        }
        
    
        
        global void execute(Database.BatchableContext BC, List<Google_API_Details__mdt> metaList) 
        {
           
         
            string clientId ;
            string clientSecret;
            string refreshToken ;
            string tokenEndpoint ;
            
            Google_API_Details__mdt mc = Google_API_Details__mdt.getInstance('Latest_value');
  
            clientId     = mc.client_iD__c;
            clientSecret = mc.client_secret__c;
            refreshToken = mc.refresh_Token__c;
            tokenEndpoint= mc.token_Endpoint__c;
            
            HttpRequest request = new HttpRequest();
            
            request.setEndpoint(tokenEndpoint);
            request.setMethod('POST');
            request.setHeader('Content-Type', 'application/x-www-form-urlencoded');
            request.setBody('grant_type=refresh_token&refresh_token=' + refreshToken + '&client_id=' + clientId + '&client_secret=' + clientSecret);
            
            Http http = new Http();
            HttpResponse response = http.send(request);
            
            String accessToken = null;
            
            if (response.getStatusCode() == 200) 
            {
                Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
                
                accessToken = (String) responseMap.get('access_token');
               
             }
            
            else
            {
                System.debug('Error getting access token: ' + response.getBody());
             }
                
                
                // Store the access token in custom metadata
                
            
           Metadata.CustomMetadata mdata = new Metadata.CustomMetadata();
            
           mdata.fullName = 'Google_API_Details__mdt.'+metalist[0].DeveloperName; 
            
           mdata.label = metalist[0].MasterLabel;
        
           
           Metadata.CustomMetadataValue instance = new Metadata.CustomMetadataValue();
            
           instance.field = 'Access_Token__c';
           instance.value = accessToken;
                                                    //adding the value to the record
           mdata.values.add(instance);
           
        
         
            Metadata.DeployContainer container = new Metadata.DeployContainer();
      
            
           container.addMetadata(mdata);
       
           Metadata.Operations.enqueueDeployment(container, null);
     
        }
        
        global void finish(Database.BatchableContext BC) 
        {
            system.debug('itss done');
        }
    }
                                                  
                                                           
                                                                            //Database.executeBatch(new updateTokenValueAsynch(), 1);