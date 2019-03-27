var request = require("request");
module.exports = function (context, req) {
    context.log('Authenticating Kaizala...');
    let accessToken = "";
    const appSecret = /*"X7UAXNS5F9"*/ req.body.appSecret;
    const applicationId = /*"6292396a-bab7-4f57-9f1d-5d1e2ce9215a"*/  req.body.appId;
    const refreshToken = req.body.refreshToken //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm46bWljcm9zb2Z0OmNyZWRlbnRpYWxzIjoie1wicGhvbmVOdW1iZXJcIjpcIisyNTQ3MDU1NTAwNjRcIixcImNJZFwiOlwiXCIsXCJ0ZXN0U2VuZGVyXCI6XCJmYWxzZVwiLFwiYXBwTmFtZVwiOlwiY29tLm1pY3Jvc29mdC5tb2JpbGUua2FpemFsYWFwaVwiLFwiYXBwbGljYXRpb25JZFwiOlwiNjI5MjM5NmEtYmFiNy00ZjU3LTlmMWQtNWQxZTJjZTkyMTVhXCIsXCJwZXJtaXNzaW9uc1wiOlwiOC40XCIsXCJhcHBsaWNhdGlvblR5cGVcIjotMSxcImRhdGFcIjpcIntcXFwiQXBwTmFtZVxcXCI6XFxcIkphbWlpIFRlbGtvbVxcXCJ9XCJ9IiwidWlkIjoiTW9iaWxlQXBwc1NlcnZpY2U6ZjJjODhiZGYtZWI4OS00NzIxLWI2MTUtOTc2ODYxMDQ0NDJiIiwidmVyIjoiMiIsIm5iZiI6MTU1MDQ5NjY1MywiZXhwIjoxNTgyMDMyNjUzLCJpYXQiOjE1NTA0OTY2NTMsImlzcyI6InVybjptaWNyb3NvZnQ6d2luZG93cy1henVyZTp6dW1vIiwiYXVkIjoidXJuOm1pY3Jvc29mdDp3aW5kb3dzLWF6dXJlOnp1bW8ifQ.wGByd_0lm4cwm_wgx59UGzK9mB8L_WasX_rxH1FQZek";

    const options = {
        uri: 'https://kms.kaiza.la/v1/accessToken',
        method: 'GET',
        headers: {
            "applicationId": applicationId,
            "applicationSecret": appSecret,
            "refreshToken": refreshToken
        }
    };
    context.log(JSON.stringify(options.headers));
    request(options, function (error, response, body) {
        context.log("Back");
        context.log("Status code: " + response.statusCode);
        if(error){
            context.res = {
                body: "error"
            };
            context.log("Error " + error );
            context.done();
        } else if (!error && response.statusCode == 200) {
          context.res = {
              body: (JSON.parse(body)).accessToken
          };
          accessToken = (JSON.parse(body)).accessToken;
          context.log(accessToken);
          context.done();
        }
    });
};