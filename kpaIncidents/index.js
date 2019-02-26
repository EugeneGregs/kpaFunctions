var request = require("request");
module.exports = function (context, req) {
    context.log('Control Function started..');

    // For registering webhook
    if(req.query.validationToken){
        context.res = {
            body: JSON.parse(req.query.validationToken)
        }
        context.done();
    } else{
        context.log("Am in...");
        if(req.body.eventType == "ActionResponse" || req.body.eventType == "SurveyResponse" || req.body.eventType == "ActionCreated"){
            var options = {
                uri: 'http://localhost:7071/api/saveToDb',
                method: 'POST',
                json: req.body
            };

            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                //   context.log("Done");
                context.res = {
                    body: body
                }
                  context.done();
                }
            });
        } else if(req.body.eventType == "JobResponse" || req.body.eventType == "JobCreated"){
            var options = {
                uri: 'http://localhost:7071/api/updateJobstatus',
                method: 'POST',
                json: req.query.body
            };

            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  context.log("Done");
                  context.done();
                }
            });
        }
       
    }
};