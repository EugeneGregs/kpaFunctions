var request = require("request");
module.exports = async function (context, req) {
    context.log('Function started..');
    let reqData = req.body;
    let cardData = (typeof reqData == 'object' && typeof cardData != null) ? reqData : JSON.parse(reqData);
    let name =  cardData.subscriberName;
    let number = cardData.subscriberPhone;

    if (cardData.error == "true") {
        let incidentId = cardData.incidentId
        sendCardWithoutError();
    } else {
        sendCardwithErrorMessage();
    }

    function sendCardWithoutError() {
        //send action to safety team
        //authenticate Kaizala(get access token)
        //send card to subscriber
        //Update actionId to database
    }
    
};