const request = require(`request`);

// Translate JSON message into Text
exports.notifyMicrosoftTeams = async (pubsubEvent, context) => {
    const pubsubData = Buffer.from(pubsubEvent.data, 'base64').toString();
    const alert = JSON.parse(pubsubData);
   
    // Format of message can be found here: https://cloud.google.com/billing/docs/how-to/budgets-programmatic-notifications#notification_format
    // If there was an alert threshold breached
    if ("alertThresholdExceeded" in alert) {
        let title = "GCP Budget Alert Threshold Exceeded"

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
                    "facts": [
                    {
                        "name": "Budget Name:",
                        "value": alert.budgetDisplayName
                    },
                    {
                        "name": "Current Spend:",
                        "value": alert.costAmount
                    },
                    {
                        "name": "Budget Amount Exceeded:",
                        "value": alert.budgetAmount
                    },
                    {
                        "name": "Alert Threshold:",
                        "value": alert.alertThresholdExceeded * 100
                    },
                    {
                        "name": "Currency Type:",
                        "value": alert.currencyCode
                    },
                    {
                        "name": "Budget Start Date:",
                        "value": alert.costIntervalStart
                    }
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

    } else if ("forecastThresholdExceeded" in alert) {
        let title = "GCP Budget Forecast Threshold Exceeded"

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
                    "facts": [
                    {
                        "name": "Budget Name:",
                        "value": alert.budgetDisplayName
                    },
                    {
                        "name": "Current Spend:",
                        "value": alert.costAmount
                    },
                    {
                        "name": "Forecast Amount Exceeded:",
                        "value": alert.budgetAmount
                    },
                    {
                        "name": "Forecast Threshold:",
                        "value": alert.forecastThresholdExceeded * 100
                    },
                    {
                        "name": "Currency Type:",
                        "value": alert.currencyCode
                    },
                    {
                        "name": "Budget Start Date:",
                        "value": alert.costIntervalStart
                    }
                    ],
                    "text": "A GCP project that you are monitoring for cost increases IS FORECASTED to exceeded its monthly budget."
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

    } else {
        // Uncomment the section below if you wish to get general updates about a budget. This will be noisy! Updates are sent every 20 to 30 minutes per budget.
        /*
        let title = "Budget Update"

        // Post message to the room
        request({
            uri: process.env.TEAMS_WEBHOOK,
            method: "POST",
            json: {
                "@type": "MessageCard",
                "themeColor": "FF0000",
                "title": title,
                "summary": "A GCP project or group of projects that you have cost alerting enabled on has budget updates enabled.", 
                "sections": [
                {
                    "facts": [
                    {
                        "name": "Budget Name:",
                        "value": alert.budgetDisplayName
                    },
                    {
                        "name": "Current Spend:",
                        "value": alert.costAmount
                    },
                    {
                        "name": "Budget Amount:",
                        "value": alert.budgetAmount
                    },
                    {
                        "name": "Currency Type:",
                        "value": alert.currencyCode
                    },
                    {
                        "name": "Budget Start Date:",
                        "value": alert.costIntervalStart
                    }
                    ],
                    "text": "This is a periodic update on your budget threshold."
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
        */
    }
    
};

