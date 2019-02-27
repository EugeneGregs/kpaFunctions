var request = require("request");
// You should include context, other arguments are optional
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    //This alternates between JobCreated and Job response actions
    if (req.body.eventType == "JobCreated") {

        //Use assigned to to get info of assigned officer from the officers table 
        var options = {
            uri: 'http://localhost:7071/api/getOfficerDetails',
            method: 'POST',
            json: req.body
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                context.res = {
                    body: body
                }
                context.done();
            }
        });


    }

    else if (req.body.eventType == "JobResponse") {
        var options = {
            uri: 'http://localhost:7071/api/changeJobStatus',
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

        context.done();
    }

};