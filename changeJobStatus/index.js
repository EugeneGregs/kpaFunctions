var request = require("request");
var sql = require("mssql");
module.exports = function (context, req) {

    context.log('Function changeJobStatus Started');
    
    let job_card_id = req.body.data.actionId;
    
    var isCompleted = req.body.data.responseDetails.response.isCompleted;

    const config = {
        user: 'Eugene@kaizalaprojects-server',
        password: 'r6r5bb!!',
        server: 'kaizalaprojects-server.database.windows.net',
        database: 'kaizalaProjectsdb',

        options: {
            encrypt: true
        }
    }

    changeJobStatus();

    function changeJobStatus() {
        if (isCompleted){
            var query = `UPDATE dbo.kpa_incidents SET incident_status = 5 WHERE jobcard_id = '${job_card_id}'`;
            updateDb(query, 5);
        }else{
            var query = `UPDATE dbo.kpa_incidents SET incident_status = 3 WHERE jobcard_id = '${job_card_id}'`;
            updateDb(query, 3);
        }
    }

    // function to update job status in the incidents table
    function updateDb(query, status) {
        context.log(query);
        sql.connect(config).then(() => {
            context.log("Reached this 1st  point")  
            return sql.query(query)
        }).then(() => {                      
            context.log("Reached this 2nd  point")  
            sql.close()
            sendData(status)
            // context.done()

        }).catch(err => {
            context.log(err)
            
            context.res = {
                body: err
            }
            sql.close()
            context.done()
        })

        sql.on('error', err => {
            context.log(err)
            // sendActionToUserWithError();
            context.res = {
                body: err
            }
            sql.close()
            context.done()
        })
    }

    function sendData(status){

        const data = {
            "cardId": job_card_id,
            "status": status
        }

        const option = {
            uri: 'https://kpaincidentsfunc.azurewebsites.net/api/changeStatus?code=uarbX5A0zMgdGmOSMRwcju/B3v5JHX7wKFOMj2OxvZAaPP8AJXmYzA==',
                method: 'POST',
                json: data
        }

        request(option, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                context.res = {
                    body: body
                }
                context.log("Done Finally")
                context.done();
            }
        });

    }

};