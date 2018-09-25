const webpush = require('web-push');
const config = require('../../../config');

webpush.setGCMAPIKey(config.gcmKey); // required to support older browsers (Chrome < 63)
webpush.setVapidDetails(config.abuseEmail, config.vapidKeys.publicKey, config.vapidKeys.privateKey);

const sendNotification = (token, title, body) => {
    //create notification payload
    const payload = {
        title: title,
        body: body,
    };

    //send push notification
    webpush.sendNotification(JSON.parse(token), JSON.stringify(payload))
        .then(() => {})
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
        });
};

//export all functions
module.exports = {sendNotification};