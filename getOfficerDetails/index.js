var request = require("request");
var sql = require("mssql");
module.exports = function (context, req) {

    context.log('Function Started');

    var incidentNumber = 0;
    var status = 0;
    let officer_phone_number = req.body.data.assignedTo[0];
    var officer_id = 0;
    let job_card_id = req.body.data.actionId;
    let theArray = req.body.data.title.split(' ');
    let incident_id = theArray[theArray.length-1];

    const config = {
        user: 'Eugene@kaizalaprojects-server',
        password: 'r6r5bb!!',
        server: 'kaizalaprojects-server.database.windows.net',
        database: 'kaizalaProjectsdb',

        options: {
            encrypt: true
        }
    }

    getOfficerDetails();



    function getOfficerDetails() {

        var query = `SELECT * FROM dbo.kpa_officers WHERE officer_phone_number='${officer_phone_number}'`;

        getFromDb(query);

    }

    function updateIncidentsTable() {
        var query = `UPDATE dbo.kpa_incidents SET officer_assigned_id = ${officer_id}, jobcard_id = '${job_card_id}', incident_status = 2 WHERE incident_number = '${incident_id}'`;


        updateDb(query);

        


    }

    // function to query officer details from the officers table
    function getFromDb(query) {
        context.log(query);
        sql.connect(config).then(() => {

            return sql.query(query)

        }).then(result => {
            let idArray = Object.values(result.recordsets[0][0]);

            officer_id = idArray[0]
            updateIncidentsTable();

            // complete details from the select * sql command;

            context.res = {
                body: result
            };



            // sql.close()
            // context.done()
        }).catch(err => {
            context.log(err)
            // sendActionToUserWithError();
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

    // function to query job status and incidentNumber from the incidents table
    function getFromIncidentsDb(query) {
        sql.close()
        context.log(query);
        sql.connect(config).then(() => {

            return sql.query(query)
            

        }).then(result => {
            let idArray = Object.values(result.recordsets[0][0]);

            incidentNumber = idArray[0]
            status = idArray[1]

            context.log("8888888888888888888888888888888888888888888888888888")
            context.log(incidentNumber+ ' '+ status)
            context.log('8888888888888888888888888888888888888888888888888888')

            var options = {
                uri: 'http://localhost:7071/api/changeStatus',
                method: 'POST',
                json: {
                    "incidentNumber": incidentNumber,
                    "status": status
                }
            };
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    context.res = {
                        body: body
                    }
    
                    context.done();
                }
            });

            // complete details from the select * sql command;

            context.res = {
                body: result
            };

            // sql.close()
            // context.done()
        }).catch(err => {
            context.log(err)
            // sendActionToUserWithError();
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

    // function to update officer details in the incidents table
    function updateDb(query) {
        sql.close();
        context.log(query);
        context.log("query");
        sql.connect(config).then(() => {
            context.log("Reached this point")

            return sql.query(query)

        }).then(() => {

            // sql.close()

            context.log("Start the retrieve data function")
            sendData();            

            
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

    function sendData(){
        //This retrieves job status and incident number data for eugene
        //send details to change status text

        const data = {
            "incidentNumber": incident_id,
            "status": 2
        }

        const option ={
            uri: 'http://localhost:7071/api/changeStatus',
                method: 'POST',
                json: data
        }

        request(option, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                context.res = {
                    body: body
                }

                context.done();
            }
        });

        // var query = `SELECT incident_status, incident_number FROM dbo.kpa_incidents WHERE jobcard_id='${job_card_id}'`;

        // context.log("Start the get incidents from db function")
        // getFromIncidentsDb(query);      
        
        //This retrieves data for eugene
    }


};