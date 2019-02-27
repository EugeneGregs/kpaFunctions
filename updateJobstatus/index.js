var request = require("request");
// You should include context, other arguments are optional
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    //This alternates between JobCreated and Job response actions
    if (req.body.eventType == "JobCreated") {

        //Use assigned to to get info of assigned officer from the officers table 
        var options = {
            uri: 'https://kpaincidentsfunc.azurewebsites.net/api/getOfficerDetails?code=Mm/jHQcQH/IhUTe0fXq7DEHRUo8knw6U7Vwmhz3N3iKPazp/d45Uxg==',
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
            uri: 'https://kpaincidentsfunc.azurewebsites.net/api/changeJobStatus?code=7mRUBMdSDW4owEawfjOnPmpuHftDem8s75vH7Lz9jkTxb0xxKRTR/Q==',
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