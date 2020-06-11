const request = require(`request`);

// Translate JSON message into Text
exports.notifyHangouts = async (pubsubEvent, context) => {
    const pubsubData = Buffer.from(pubsubEvent.data, 'base64').toString();
    const alert = JSON.parse(pubsubData);
   


    // Post message to the room
    request({
      uri: "<insert webhook url>",
      method: "POST",
      json: {
  "text": "One of your GCP Projects has exceeded its monthly budget.",
  "cards": [
    {
      "header": {
        "title": "GCP Billing Alert",
        "subtitle": "Automated Budget Notificaiton",
        "imageUrl": "https://goo.gl/aeDtrS"
      },
      "sections": [
        {
          "widgets": [
              {
                "keyValue": {
                  "topLabel": "Budget Exceeded",
                  "content": alert.budgetDisplayName
                  }
              },
              {
                "keyValue": {
                  "topLabel": "Budget Start Date",
                  "content": alert.costIntervalStart.toString()
                }
              },
              {
                "keyValue": {
                  "topLabel": "Budget Amount",
                  "content": alert.budgetAmount.toString()
                }
              },
              {
                "keyValue": {
                  "topLabel": "Alert Threshold",
                  "content": alert.alertThresholdExceeded.toString()
                }
              },
              {
                "keyValue": {
                  "topLabel": "Current Spend",
                  "content": alert.costAmount.toString()
                }
              },
              {
                "keyValue": {
                  "topLabel": "Currency Type",
                  "content": alert.currencyCode.toString()
                }
              }
          ]
        },
        {
          "widgets": [
              {
                  "buttons": [
                    {
                      "textButton": {
                        "text": "OPEN THE GCP CONSOLE",
                        "onClick": {
                          "openLink": {
                            "url": "https://console.cloud.google.com"
                          }
                        }
                      }
                    }
                  ]
              }
          ]
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

};
