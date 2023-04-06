@RESTResource(urlMapping='/myOpportunity/*')
Global class CreateOppAPI 
{
     @HttpGet
    global static List<Opportunity> getMyOpportunities()
    {
        String userId = '0055g00000HB1d9';                                                     //UserInfo.getUserId()
        List<Opportunity> opportunities = [SELECT Id, Name, CloseDate, Amount FROM Opportunity WHERE OwnerId = :userId ];
        return opportunities;
    }   

}