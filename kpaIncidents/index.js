var sql = require("mssql");
module.exports = function (context, req) {
    context.log('Function started..');

    // For registering webhook
    if(req.query.validationToken){
        context.res = {
            body: JSON.parse(req.query.validationToken)
        }
        context.done();
    } else{

        //Database connection object
        const config = {
            user: 'Eugene@kaizalaprojects-server',
            password: 'Kalolingi123',
            server: 'kaizalaprojects-server.database.windows.net',
            database: 'kaizalaProjectsdb',
         
            options: {
                encrypt: true 
            }
        }

        // For creating new case
        if (req.body) {
            var resData = req.body.data.responseDetails.responseWithQuestions;

            // for personnel incident
            if(resData[0].title == "Name of injured person") {
                const name_of_injured_person = resData[0].answer;
                const injured_person_check_number = resData[1].answer;
                const injury_extent = resData[2].answer;
                const part_of_body_injured = resData[3].answer;
                const injured_person_working_area = resData[4].answer;
                const injured_person_designation = resData[5].answer;
                const injury_caused_by = resData[6].answer ? resData[6].answer : resData[7].answer;
                const injury_causative_agent = resData[8].answer ? resData[8].answer : resData[9].answer;
                const location_of_incident = resData[10].answer;
                const specific_location = resData[11].answer;
                const brief_summary = resData[12].answer;
                const incident_date_and_time = resData[13].answer;
                const attachment_url_array = resData[14].answer;
                const attachment_url = /* attachment_url_array[0].mediaUrl + "/" + attachment_url_array[0].mediaFileName */ "exampleimage.jpg"
                const name_of_reporting_person = resData[15].answer;
                const reporting_person_phone = resData[16].answer;
                const incident_category = "Personnel";
                const incident_status = 1;

                var query = `INSERT INTO dbo.kpa_incidents (
                    incident_category,
                    name_of_injured_person,
                    injured_person_check_number,
                    injury_extent,
                    part_of_body_injured,
                    injured_person_working_area,
                    injured_person_designation,
                    injury_caused_by,
                    injury_causative_agent,
                    location_of_incident,
                    specific_location,
                    brief_summary,
                    attachment_url,
                    name_of_reporting_person,
                    reporting_person_phone,
                    incident_status
                    )
                    VALUES (
                    '${incident_category}',
                    '${name_of_injured_person}',
                    '${injured_person_check_number}',
                    '${injury_extent}',
                    '${part_of_body_injured}',
                    '${injured_person_working_area}',
                    '${injured_person_designation}',
                    '${injury_caused_by}',
                    '${injury_causative_agent}',
                    '${location_of_incident}',
                    '${specific_location}',
                    '${brief_summary}',
                    '${attachment_url}',
                    '${name_of_reporting_person}',
                    '${reporting_person_phone}',
                    '${incident_status}'
                )`;

                saveToDb(query);

            } else {
                // sql.close();
                //for cargo/machinery incident
                const damage_category = resData[0].answer;
                const equipment_involved = resData[1].answer;
                const equipment_marks = resData[2].answer;
                const operator_involved = resData[3].answer;
                const operator_check_number = resData[4].answer;
                const operator_designation = resData[5].answer;
                const operator_working_area = resData[6].answer;
                const location_of_incident = resData[7].answer;
                const specific_location = resData[8].answer;
                const brief_summary = resData[9].answer;
                const incident_date_and_time = resData[10].answer;
                const attachment_url_array = resData[11].answer;
                const attachment_url = attachment_url_array[0].mediaUrl + "/" + attachment_url_array[0].mediaFileName
                const name_of_reporting_person = resData[12].answer;
                const reporting_person_phone = resData[13].answer;
                const incident_category = "Machinery";
                const incident_status = 1;

                var query = `INSERT INTO dbo.kpa_incidents (
                    incident_category,
                    damage_category,
                    equipment_involved,
                    equipment_marks,
                    operator_involved,
                    operator_designation,
                    operator_working_area,
                    location_of_incident,
                    specific_location,
                    brief_summary,
                    attachment_url,
                    name_of_reporting_person,
                    reporting_person_phone,
                    incident_status
                    )
                    VALUES (
                    '${incident_category}',
                    '${damage_category}',
                    '${equipment_involved}',
                    '${equipment_marks}',
                    '${operator_involved}',
                    '${operator_designation}',
                    '${operator_working_area}',
                    '${location_of_incident}',
                    '${specific_location}',
                    '${brief_summary}',
                    '${attachment_url}',
                    '${name_of_reporting_person}',
                    '${reporting_person_phone}',
                    '${incident_status}'
                )`;

                saveToDb(query);
            }
        }
        
        // getAllIncidents();
        function getAllIncidents(){
            sql.connect(config).then(() => {
                return sql.query`select * from dbo.kpa_incidents`
            }).then(result => {
                context.log(result)
                context.res = {
                    body: JSON.stringify(result)
                };
                // sql.close()
                context.done()
            }).catch(err => {
                context.log(err)
                context.done()
            })
            
            sql.on('error', err => {
                context.log(err)
                context.done()
            })

        }

        function saveToDb(query) {
           
            context.log(query);
            sql.connect(config).then(() => {
                return sql.query(query)
            }).then(result => {
                context.log("Done")
                context.res = {
                    body: "done"
                };
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
                context.res = {
                    body: err
                }
                sql.close()
                context.done()
            })
            
        }
    }
};