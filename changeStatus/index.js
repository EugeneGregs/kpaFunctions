sql = require("mssql");
request = require("request");
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const dataObj = ( typeof req.body == "object" && typeof req.body != null ) ? req.body : JSON.parse( req.body);
    let incidentNumber = dataObj.incidentNumber ? dataObj.incidentNumber : "";
    let cardId = dataObj.cardId ? dataObj.cardId : "";
    let status = dataObj.status;
    let statusText;
    let accessToken;
    let updateCardId;

    if(status == 1){
        statusText = "Pending";
    } else if (status == 2) {
        statusText = "Assigned to officer";
    } else if (status == 3) {
        statusText = "In progress";
    } else if (status == 4) {
        statusText = "Canceled";
    } else {
        statusText = "Complete";
    }

    incidentNumber ? fetchCardId("incident_number", incidentNumber) : fetchCardId("jobcard_id", cardId);

    function fetchCardId(dbField, dbValue) {
        const config = {
            user: 'Eugene@kaizalaprojects-server',
            password: 'r6r5bb!!',
            server: 'kaizalaprojects-server.database.windows.net',
            database: 'kaizalaProjectsdb',
         
            options: {
                encrypt: true 
            }
        }
        const query = `SELECT update_action_id FROM dbo.kpa_incidents WHERE ${dbField} = '${dbValue}'`;

        sql.connect(config).then(() => {
            return sql.query(query)
        }).then(result => {
            sql.close();
            updateCardId = result.recordset[0].update_action_id;
            context.log(result)
            context.log(query)
            getAccessToken();
        }).catch(err => {
            context.log(err)
            sql.close();
            context.done();
        })
        
        sql.on('error', err => {
            context.log(err)
            sql.close();
            context.done();
        })
    }

    function updateCardStatus() {
        const endPointUrl = "https://kms.kaiza.la/v1/groups/ec8b65a6-a746-4000-ae64-92c84c102e5c/actions/" + updateCardId;
        const actionBodyObj = {
            "version":-1,
            "sendNotificationToSubscribers":true,
            "sendToAllSubscribers":true,
            "updateProperties":
            [
            {
            "name": "incidentStatus",
            "type" : "Text",
            "value" : "STATUS: " + statusText
            }
            ]
            }
        const cardOptions = {
            uri: endPointUrl,
            method: "PUT",
            headers: {
                "accessToken": accessToken,
                "contentType": "application/json"
            },
            json: actionBodyObj
        }

        request(cardOptions, function(error, response, body){
            if(error){
                context.log(error)
            } else if(!error && response.statusCode == 200) {
                context.log("Done");
                context.done();
            }
        })
    }

    function getAccessToken() {
        const authDetails = {
            "appSecret": "X7UAXNS5F9",
            "appId": "6292396a-bab7-4f57-9f1d-5d1e2ce9215a",
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm46bWljcm9zb2Z0OmNyZWRlbnRpYWxzIjoie1wicGhvbmVOdW1iZXJcIjpcIisyNTQ3MDU1NTAwNjRcIixcImNJZFwiOlwiXCIsXCJ0ZXN0U2VuZGVyXCI6XCJmYWxzZVwiLFwiYXBwTmFtZVwiOlwiY29tLm1pY3Jvc29mdC5tb2JpbGUua2FpemFsYWFwaVwiLFwiYXBwbGljYXRpb25JZFwiOlwiNjI5MjM5NmEtYmFiNy00ZjU3LTlmMWQtNWQxZTJjZTkyMTVhXCIsXCJwZXJtaXNzaW9uc1wiOlwiOC40XCIsXCJhcHBsaWNhdGlvblR5cGVcIjotMSxcImRhdGFcIjpcIntcXFwiQXBwTmFtZVxcXCI6XFxcIkphbWlpIFRlbGtvbVxcXCJ9XCJ9IiwidWlkIjoiTW9iaWxlQXBwc1NlcnZpY2U6ZjJjODhiZGYtZWI4OS00NzIxLWI2MTUtOTc2ODYxMDQ0NDJiIiwidmVyIjoiMiIsIm5iZiI6MTU1MDQ5NjY1MywiZXhwIjoxNTgyMDMyNjUzLCJpYXQiOjE1NTA0OTY2NTMsImlzcyI6InVybjptaWNyb3NvZnQ6d2luZG93cy1henVyZTp6dW1vIiwiYXVkIjoidXJuOm1pY3Jvc29mdDp3aW5kb3dzLWF6dXJlOnp1bW8ifQ.wGByd_0lm4cwm_wgx59UGzK9mB8L_WasX_rxH1FQZek"
    
        };
        const options = {
            uri: "https://kpaincidentsfunc.azurewebsites.net/api/authKaizala?code=7RdL2taMnJ1YlwDFsTwz87ODa9xGKKEgNNi1ZNZZC6gKYblYeiRsbQ==",
            method: "POST",
            json: authDetails
        }
    
        //Get Kaizala access Token
        request(options, function(error, response, body){
            if(!error && response.statusCode == 200) {
                accessToken = body;
                context.log(accessToken);
                updateCardStatus();
                // context.done();
            } else if(error) {
                context.log(error);
            }
        });
    }

};