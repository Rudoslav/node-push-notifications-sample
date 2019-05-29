const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));
webPush.setVapidDetails('mailto:test@test.com', process.env.PUBLIC_VAPID, process.env.PRIVATE_VAPID);

//subscribe route
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    //send 201 - resource created
    res.status(201).json({});
    //create payload
    const payload = JSON.stringify({title: 'Push test'});
    //pass obj into sendNotification
    webPush.sendNotification(subscription, payload)
        .catch(err => console.error(err));
});

app.listen(process.env.PORT, () => console.log(`App runs on port ${process.env.PORT}`));

