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
                uri: 'https://kpaincidentsfunc.azurewebsites.net/api/saveToDb?code=Rqo4Uonj2SxUqay6bpgCNmhcqiwRU7zcr71MV5jJvNPrdTFRxaZRvg==',
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
                uri: 'https://kpaincidentsfunc.azurewebsites.net/api/updateJobstatus?code=DPzH8QaNNB61NZeY603DHHm9Yfe3bxVDR8yGAHD3cePuGUaCy555FA==',
                method: 'POST',
                json: req.body
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