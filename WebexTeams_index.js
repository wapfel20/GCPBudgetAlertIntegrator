const request = require(`request`);

// Translate JSON message into Text
exports.notifyWebexTeams = async (pubsubEvent, context) => {
    const pubsubData = Buffer.from(pubsubEvent.data, 'base64').toString();
    const alert = JSON.parse(pubsubData);


    // Post message to the room
    request({
      uri: "<insert webhook ulr>",
      method: "POST",
      json: {
          markdown: "**GCP Billing Alert**: One of your GCP Projects has exceeded its monthly budget.  \n**-  Budget Exceeded:** " + alert.budgetDisplayName + "  \n**-  Budget Start Date:** " + alert.costIntervalStart + "  \n**-  Budget Amount:** " + alert.budgetAmount + "  \n**-  Alert Threshold:** " + alert.alertThresholdExceeded + "  \n**-  Current Spend:** " + alert.costAmount + "  \n**-  Currency Type:** " + alert.currencyCode + "  \n**[OPEN THE GCP BILLING CONSOLE](http://console.cloud.google.com/billing)**"
      },
    }, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
    }
});

};
