const request = require("request");
const sql = require("mssql");
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(req.body);
    const reqBody = (typeof req.body == "object" && typeof req.body != null) ? req.body : JSON.parse(req.body);
    const groupId = reqBody.groupId;
    const propertiesArray = reqBody.propertiesArray;
    const actionId = reqBody.actionId;
    const appSecret = reqBody.appSecret;
    const appId = reqBody.appId;
    const refreshToken = reqBody.refreshToken;
    const isSendToAll = req.body.sendToAll;
    let update_action_id;
    const subscriberNumber = ( isSendToAll == false || isSendToAll == "false" ) ? reqBody.subscriberNumber : "";
    const endPointUrl = "https://kms.kaiza.la/v1/groups/" + groupId + "/actions";
    let accessToken = "";
    const incident_id = reqBody.incident_id ? reqBody.incident_id : "";
    const authDetails = {
        "appSecret": appSecret,//"X7UAXNS5F9"
        "appId": appId,//"6292396a-bab7-4f57-9f1d-5d1e2ce9215a"
        "refreshToken": refreshToken//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm46bWljcm9zb2Z0OmNyZWRlbnRpYWxzIjoie1wicGhvbmVOdW1iZXJcIjpcIisyNTQ3MDU1NTAwNjRcIixcImNJZFwiOlwiXCIsXCJ0ZXN0U2VuZGVyXCI6XCJmYWxzZVwiLFwiYXBwTmFtZVwiOlwiY29tLm1pY3Jvc29mdC5tb2JpbGUua2FpemFsYWFwaVwiLFwiYXBwbGljYXRpb25JZFwiOlwiNjI5MjM5NmEtYmFiNy00ZjU3LTlmMWQtNWQxZTJjZTkyMTVhXCIsXCJwZXJtaXNzaW9uc1wiOlwiOC40XCIsXCJhcHBsaWNhdGlvblR5cGVcIjotMSxcImRhdGFcIjpcIntcXFwiQXBwTmFtZVxcXCI6XFxcIkphbWlpIFRlbGtvbVxcXCJ9XCJ9IiwidWlkIjoiTW9iaWxlQXBwc1NlcnZpY2U6ZjJjODhiZGYtZWI4OS00NzIxLWI2MTUtOTc2ODYxMDQ0NDJiIiwidmVyIjoiMiIsIm5iZiI6MTU1MDQ5NjY1MywiZXhwIjoxNTgyMDMyNjUzLCJpYXQiOjE1NTA0OTY2NTMsImlzcyI6InVybjptaWNyb3NvZnQ6d2luZG93cy1henVyZTp6dW1vIiwiYXVkIjoidXJuOm1pY3Jvc29mdDp3aW5kb3dzLWF6dXJlOnp1bW8ifQ.wGByd_0lm4cwm_wgx59UGzK9mB8L_WasX_rxH1FQZek"

    };
    const options = {
        uri: "http://localhost:7071/api/authKaizala",
        method: "POST",
        json: authDetails
    }

    //Get Kaizala access Token
    request(options, function(error, response, body){
        if(!error && response.statusCode == 200) {
            accessToken = body;
            context.log(accessToken);
            sendCard();
            // context.done();
        }
    });

    //send action card
    function sendCard() {
        let actionBodyObj;

        if(isSendToAll == true || isSendToAll == "true") {
            actionBodyObj = {
                id: actionId,
                // subscribers: [subscriberNumber],
                sendToAllSubscribers: true,
                actionBody:{
                properties: propertiesArray
                }
            }

        } else if(isSendToAll == false || isSendToAll == "false"){
            actionBodyObj = {
                id: actionId,
                subscribers: [subscriberNumber],
                sendToAllSubscribers: true,
                actionBody:{
                properties: propertiesArray
                }
            }
        }
        const cardOptions = {
            uri: endPointUrl,
            method: "POST",
            headers: {
                "accessToken": accessToken,
                "contentType": "application/json"
            },
            json: actionBodyObj
        }

        request(cardOptions, function(error, response, body){
            if (error){
                context.log(error);
                context.done();
            } else if(response.statusCode == 200){
                context.log("Card sent");
                bodyObj = (typeof body == "object" && typeof body != null) ? body : JSON.parse(body);
                update_action_id = bodyObj.actionId;
                updateCardIdToDb();
                // context.done();
            }
        });
    }

    function updateCardIdToDb() {
        const query = `UPDATE dbo.kpa_incidents SET update_action_id = '${update_action_id}' WHERE incident_number = '${incident_id}'`;
        const config = {
            user: 'Eugene@kaizalaprojects-server',
            password: 'r6r5bb!!',
            server: 'kaizalaprojects-server.database.windows.net',
            database: 'kaizalaProjectsdb',
         
            options: {
                encrypt: true 
            }
        }

        sql.connect(config).then(() => {
            return sql.query(query)
        }).then(result => {
            sql.close();
            context.res = {
                body: "Card sent and Updated"
            }
            context.done();
        }).catch(err => {
            context.log(err)
            context.res = {
                body: err
            }
            sql.close();
            context.done();
        })
        
        sql.on('error', err => {
            context.log(err)
            context.res = {
                body: err
            }
            sql.close();
            context.done();
        })
    }

};