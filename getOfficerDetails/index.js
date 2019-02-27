var request = require("request");
var sql = require("mssql");
module.exports = function (context, req) {

    context.log('Function Started');

    let officer_phone_number = req.body.data.assignedTo[0];
    let reporting_person_phone = req.body.fromUser;
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

    // function to update officer details in the incidents table
    function updateDb(query) {
        sql.close();
        context.log(query);
        context.log("query");
        sql.connect(config).then(() => {
            context.log("Reached this point")

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