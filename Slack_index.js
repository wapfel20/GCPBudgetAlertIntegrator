const request = require(`request`);

// Translate JSON message into Text
exports.notifySlack = async (pubsubEvent, context) => {
    const pubsubData = Buffer.from(pubsubEvent.data, 'base64').toString();
    const alert = JSON.parse(pubsubData);

    // Post message to the room
    request({
      uri: "<insert webhook url>",
      method: "POST",
      json: {
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*GCP Billing Alert* \n One of your GCP Projects has exceeded its monthly budget."
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Budget Exceeded:* " + alert.budgetDisplayName + "\n *Budget Start Date:* " + alert.costIntervalStart + "\n *Budget Amount:* " + alert.budgetAmount + "\n *Alert Threshold:* " + alert.alertThresholdExceeded + "\n *Current Spend:* " + alert.costAmount + "\n *Currency Type:* " + alert.currencyCode
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
						"text": "OPEN THE GCP BILLING CONSOLE",
						"emoji": true
					},
					"style": "primary",
					"url": "https://console.cloud.google.com/billing"
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
