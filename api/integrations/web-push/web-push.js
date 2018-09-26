const webpush = require('web-push');
const config = require('../../../config');

webpush.setVapidDetails(config.abuseEmail, config.vapidKeys.publicKey, config.vapidKeys.privateKey);

const sendNotification = (token, title, body) => {
    //create notification payload
    const payload = {
        notification: {
          title: title,
          body: body,
          icon: 'assets/icons/icon-512x512.png'
        }
    };

    //send push notification
    webpush.sendNotification(JSON.parse(token), JSON.stringify(payload))
        .then((data) => {})
        .catch(err => {
            console.error("Error sending notification, reason: ", err);
        });
};

//export all functions
module.exports = {sendNotification};
