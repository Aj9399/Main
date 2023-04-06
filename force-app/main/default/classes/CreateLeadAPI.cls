@RESTResource(urlMapping='/CreateLead/')

global class CreateLeadAPI
{
   @HTTPGet
    
    //in get method we can get the req in headers only,
    	
    Global Static String showlead()
     {
         string objName;
         Id i ;
         
         RestRequest req = RestContext.request;
         
         RestResponse res= RestContext.response;
         
        
         
         objName = req.headers.get('objectName');  
         
         i = req.headers.get('Id');
         
         string qr = 'select Name from '+objName+' where ID = :i ' +'Limit 1';
         
         sObject s = Database.query(qr);
         
         String jsonResponse = '{\"Name\":\"'+s.get('Name')+'\"}';
         
         return jsonResponse;
         
         
    }
    
    
    
    
    
    
    
    
    
    
    @HTTPPost
    Global static String CreatingLeadRecord()
    {
        
   
    
        String  fieldName , fieldValue;   
        
         String fName , lName , comp ;
        
        // and in fName , lName , comp we will store the fieldValue after comparing with fieldName ;       
        
        RESTRequest req = RestContext.request;
        
        RESTResponse res = RestContext.response;
        
        
        String jsonBody = req.requestBody.tostring(); 
        // this is the method where we get requestBody in string formate 
       
        
        JSONParser parser = JSON.createParser(jsonBody);
        
        
        While(Parser.nextToken()!= null)                                //in Next token , next value on JSON if it is not null than execute the code
          {
              if(parser.getcurrentToken() != JSONToken.END_OBJECT)
              {
                  fieldName = parser.getCurrentName();
                  fieldValue= parser.getText();
                  
                  
     //  field name and field value will use to compare in code where we have to put the json record 
    //  like we compare fieldName == 'key' , so the fieldvalue will get the value like "FirstName":"Saurav"
    //  so here "FirstName" is fieldName , and the "Saurav" is Field value .
    	
                  
                  if(fieldName == 'FirstName')
                  {
                      fName = fieldvalue;
                  }
                else  if(fieldName == 'LastName')
                  {
                      lName  = fieldValue;
                  }
                else  if(fieldName == 'company')
                  {
                     comp = fieldVAlue;  
                  }
              }
              
          }
        
        
        
      lead l = new Lead(firstName = fName , lastName = lName , company = comp);  
        
   insert l;
    return l.id;        
        
        
    }
    
    
}