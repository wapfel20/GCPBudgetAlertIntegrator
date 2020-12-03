const request = require(`request`);

// Translate JSON message into Text
exports.notifySlack = async (pubsubEvent, context) => {
    const pubsubData = Buffer.from(pubsubEvent.data, 'base64').toString();
    const alert = JSON.parse(pubsubData);

    // Format of message can be found here: https://cloud.google.com/billing/docs/how-to/budgets-programmatic-notifications#notification_format
    let title = "", message = ""
    // If there was an alert threshold breached
    if ("alertThresholdExceeded" in alert) {
        title = ":bangbang: GCP Budget Alert Threshold Exceeded :bangbang:"
        message = `*Budget Name:* ${alert.budgetDisplayName}` +
            `\n*Current Spend:* ${alert.costAmount}` +
            `\n*Budget Amount Exceeded:* ${alert.budgetAmount}` +
            `\n*Alert Threshold:* ${alert.alertThresholdExceeded * 100}%` +
            `\n*Currency Type:* ${alert.currencyCode}` +
            `\n*Budget Start Date:* ${alert.costIntervalStart}`
    } else if ("forecastThresholdExceeded" in alert) {
        title = ":warning: GCP Budget Forecast Threshold Exceeded :warning:"
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
            uri: process.env.SLACK_WEBHOOK,
            method: "POST",
            json: {
                "blocks": [
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": title,
                            "emoji": true
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": message
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "View In GCP Billing Console",
                                    "emoji": true
                                },
                                "style": "primary",
                                "url": "https://console.cloud.google.com/billing"
                            }
                        ]
                    }
                ]
            }
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                console.log(response.statusCode, body);
            }
        });
    }
};


