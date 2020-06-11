# Background
This directory holds a collection of Node.js scrips for Google Cloud Functions. The purpose of the the scrips are to provide an integration of GCP Budget Alerts to Slack, Microsoft Teams, Hanguts Chat, and Webex Teams. Each "index.js" script provided in the directory is purposed to integrate into a different collabroation platform. The mapping is as follows:

slack_index.js - Cloud Function for pushing GCP Budget Alerts to Slack
microsoftTeams_index.js - Cloud Function for pushing GCP Budget Alerts to Microsoft Teams
hangoutsChat_index.js - Cloud Function for pushing GCP Budget Alerts to Hangouts
webexTeams_index.js - Cloud Function for pushing GCP Budget Alerts to Webex Teams

The same package.json file can be used with all scripts - it simply provides the Javascript "Request" library that is uses to make CURL commands in Node.js.

#Using the Functions
To use these Cloud Function scripts to integrate GCP Budget Alerts, a user must first have created a GCP Budget in the billing console, configured it to post to a pub/sub topic, and created a webhook in the target collaboration evironment. They would then need to configure the cloud function to trigger on the pub/sub topic and push to the webhook.

Each function has a "<insert webhook url>" indicator in the code. Be sure to update this part of the code with the url of your target webhook before deploying.

For step-by-step guidance on setting up and using these functions, see my article here: 
