const request = require(`request`);

// Translate JSON message into Text
exports.notifyMicrosoftTeams = async (pubsubEvent, context) => {
    const pubsubData = Buffer.from(pubsubEvent.data, 'base64').toString();
    const alert = JSON.parse(pubsubData);
   
    // Format of message can be found here: https://cloud.google.com/billing/docs/how-to/budgets-programmatic-notifications#notification_format
    let title = "", message = ""
    // If there was an alert threshold breached
    if ("alertThresholdExceeded" in alert) {
        title = "GCP Budget Alert Threshold Exceeded"
        message = `*Budget Name:* ${alert.budgetDisplayName}` +
            `\n*Current Spend:* ${alert.costAmount}` +
            `\n*Budget Amount Exceeded:* ${alert.budgetAmount}` +
            `\n*Alert Threshold:* ${alert.alertThresholdExceeded * 100}%` +
            `\n*Currency Type:* ${alert.currencyCode}` +
            `\n*Budget Start Date:* ${alert.costIntervalStart}`
    } else if ("forecastThresholdExceeded" in alert) {
        title = "GCP Budget Forecast Threshold Exceeded"
        message = `*Budget Name:* ${alert.budgetDisplayName}` +
            `\n*Current Spend:* ${alert.costAmount}` +
            `\n*Forecast Amount Exceeded:* ${alert.budgetAmount}` +
            `\n*Forecast Threshold:* ${alert.forecastThresholdExceeded * 100}%` +
            `\n*Currency Type:* ${alert.currencyCode}` +
            `\n*Budget Start Date:* ${alert.costIntervalStart}`
    } else {
        // Uncomment the section below if you wish to get general updates about a budget. This will be noisy! Updates are sent every 20 to 30 minutes per budget.
        /*
        title = "Budget Update"
        message = `*Budget Name:* ${alert.budgetDisplayName}` +
            `\n*Current Spend:* ${alert.costAmount}` +
            `\n*Budget Amount:* ${alert.budgetAmount}` +
            `\n*Currency Type:* ${alert.currencyCode}` +
            `\n*Budget Start Date:* ${alert.costIntervalStart}`
        */
    }
    
    if (title != "" && message != "") {
    // Post message to the room
    request({
      uri: process.env.TEAMS_WEBHOOK,
      method: "POST",
      json: {
          "@type": "MessageCard",
          "themeColor": "FF0000",
          "title": title,
          "summary": "A GCP project or group of projects that you have cost alerting enabled on has exceeded its monthly budget.", 
          "sections": [
            {
              "text": message
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


