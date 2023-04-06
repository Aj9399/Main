public with sharing class GoogleDriveAPI {
    private final String CLIENT_ID = '967118658185-bb5clbfrnojl9p6d5fnpllp5dh4pg2fg.apps.googleusercontent.com';
    private final String CLIENT_SECRET = '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';
    private final String REDIRECT_URI = 'https://ajaygoodsandservices-dev-ed.lightning.force.com';
    private final String SCOPE = 'https://www.googleapis.com/auth/drive.file';
    private final String AUTH_URL = 'https://accounts.google.com/o/oauth2/auth';
    private final String TOKEN_URL = 'https://oauth2.googleapis.com/token';
    private final String REVOKE_TOKEN_URL = 'https://oauth2.googleapis.com/revoke';
    
    public  String getAuthorizationUrl() {
        String authUrl = AUTH_URL + '?response_type=code'
            + '&client_id=' + CLIENT_ID
            + '&redirect_uri=' + EncodingUtil.urlEncode(REDIRECT_URI, 'UTF-8')
            + '&scope=' + EncodingUtil.urlEncode(SCOPE, 'UTF-8');
        return authUrl;
    }
    
    public  String getAccessToken(String code) {
        String accessToken = null;
        try {
            HttpRequest req = new HttpRequest();
            req.setEndpoint(TOKEN_URL);
            req.setMethod('POST');
            String requestBody = 'code=' + code
                + '&client_id=' + CLIENT_ID
                + '&client_secret=' + CLIENT_SECRET
                + '&redirect_uri=' + EncodingUtil.urlEncode(REDIRECT_URI, 'UTF-8')
                + '&grant_type=authorization_code';
            req.setBody(requestBody);
            Http http = new Http();
            HTTPResponse res = http.send(req);
            if (res.getStatusCode() == 200) {
                Map<String, Object> responseMap = (Map<String, Object>)JSON.deserializeUntyped(res.getBody());
                accessToken = (String)responseMap.get('access_token');
            } else {
                System.debug('Error getting access token: ' + res.getStatus());
            }
        } catch (Exception e) {
            System.debug('Error getting access token: ' + e.getMessage());
        }
        return accessToken;
    }
    
    public  void revokeAccessToken(String accessToken) {
        try {
            HttpRequest req = new HttpRequest();
            req.setEndpoint(REVOKE_TOKEN_URL);
            req.setMethod('POST');
            String requestBody = 'token=' + accessToken;
            req.setBody(requestBody);
            Http http = new Http();
            HTTPResponse res = http.send(req);
            if (res.getStatusCode() != 200) {
                System.debug('Error revoking access token: ' + res.getStatus());
            }
        } catch (Exception e) {
            System.debug('Error revoking access token: ' + e.getMessage());
        }
    }
}