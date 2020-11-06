const request = require(`request`);

// Translate JSON message into Text
exports.notifyMicrosoftTeams = async (pubsubEvent, context) => {
    const pubsubData = Buffer.from(pubsubEvent.data, 'base64').toString();
    const alert = JSON.parse(pubsubData);
   
    // Check to see if the budget has been exceeded. (without this, budget updates will be sent every 30 minutes)
    if (alert.costAmount >= alert.budgetAmount) {

    // Post message to the room
    request({
      uri: "<insert webhook ulr>",
      method: "POST",
      json: {
          "@type": "MessageCard",
          "themeColor": "FF0000",
          "title": "GCP Billing Alert",
          "summary": "A GCP project or group of projects that you have cost alerting enabled on has exceeded its monthly budget.", 
          "sections": [
            {
              "facts": [
                {
                  "name": "Budget Name:",
                  "value": alert.budgetDisplayName
                },
                {
                  "name": "Budget Start Date:",
                  "value": alert.costIntervalStart
                },
                {
                  "name": "Budget Amount:",
                  "value": alert.budgetAmount
                },
                {
                  "name": "Current Spend:",
                  "value": alert.costAmount
                },
                {
                    "name": "Currency Type:",
                    "value": alert.currencyCode
                },
              ],
              "text": "A GCP project that you are monitoring for cost increases has exceeded its monthly budget."
            }
          ],
          "potentialAction": [
              {
                  "@type": "OpenUri",
                  "name": "Open the GCP Console",
                  "targets": [
                      {
                          "os": "default",
                          "uri": "https://console.cloud.google.com/"
                      }
                  ]
              }
          ]
      }
    }, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
    }
});

}
};
