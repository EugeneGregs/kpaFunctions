var request = require("request");
var sql = require("mssql");
module.exports = async function (context, req) {
    context.log('Function Started');
    const resData = req.body.data.responseDetails.responseWithQuestions;
    let name_of_reporting_person;
    let reporting_person_phone;
    let incident_id;
    const config = {
        user: 'Eugene@kaizalaprojects-server',
        password: 'r6r5bb!!',
        server: 'kaizalaprojects-server.database.windows.net',
        database: 'kaizalaProjectsdb',
     
        options: {
            encrypt: true 
        }
    }

    resData[0].title == "Name of injured person" ? savePersonnel() : saveCargo();
   
    function savePersonnel() {
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
        const attachment_url = attachment_url_array[0].mediaUrl + "/" + attachment_url_array[0].mediaFileName 
        name_of_reporting_person = resData[15].answer;
        reporting_person_phone = resData[16].answer;
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
        );SELECT SCOPE_IDENTITY()`;

        saveToDb(query);
    }

    function saveCargo() {
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
        name_of_reporting_person = resData[12].answer;
        reporting_person_phone = resData[13].answer;
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
        );SELECT SCOPE_IDENTITY()`;

        saveToDb(query);
    }

    function saveToDb(query) {
        context.log(query);
        sql.connect(config).then(() => {
            return sql.query(query)
        }).then(result => {
            let idArray = Object.values(result.recordsets[0][0]);
            context.log(idArray[0]);
            incident_id = idArray[0];
            // sendActionToUserWithoutError();
            context.res = {
                body: result
            };
            sql.close()
            return
        }).catch(err => {
            context.log(err)
            // sendActionToUserWithError();
            context.res = {
                body: err
            }
            sql.close()
            return
        })
        
        sql.on('error', err => {
            context.log(err)
            // sendActionToUserWithError();
            context.res = {
                body: err
            }
            sql.close()
            return
        })
        
    }

    function sendActionToUserWithoutError(){
        const data = {
            "subscriberName": name_of_reporting_person,
            "subscriberPhone": reporting_person_phone,
            "incidentId": incident_id,
            "error": "false"
        }
        const options = {
            uri: 'http://localhost:7071/api/sendCardToSubscriber',
            method: 'POST',
            json: data
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              context.log("Done");
              return;
            }
        });
    }

    function sendActionToUserWithError(){
        const data = {
            "subscriberName": name_of_reporting_person,
            "subscriberPhone": reporting_person_phone,
            "error": "true"
        }
        const options = {
            uri: 'http://localhost:7071/api/sendCardToSubscriber',
            method: 'POST',
            json: data
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              context.log("Done");
              return;
            }
        });
    }

    
};