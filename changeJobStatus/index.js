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
        }else{
            var query = `UPDATE dbo.kpa_incidents SET incident_status = 3 WHERE jobcard_id = '${job_card_id}'`;
        }

        updateDb(query);
    }

    // function to update job status in the incidents table
    function updateDb(query) {
        context.log(query);
        sql.connect(config).then(() => {
            context.log("Reached this 1st  point")  
            return sql.query(query)
        }).then(() => {                      
            context.log("Reached this 2nd  point")  
            sql.close()
            context.done()

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


};