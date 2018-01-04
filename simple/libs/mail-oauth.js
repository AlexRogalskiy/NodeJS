/**
 * Module dependencies
 */
const bunyan = require('bunyan');
const nodemailer = require('../lib/nodemailer');

let logger = bunyan.createLogger({
    name: 'nodemailer'
});
logger.level('trace');

let transporter = nodemailer.createTransport(
    {
        service: 'Gmail',
        auth: {
            type: 'OAuth2',
            user: 'mail',
            clientId: 'clientid',
            clientSecret: 'clientsecret',
            refreshToken: 'refreshtoken',
            accessToken: 'accesstoken',
            expires: 12345
        },
        logger,
        debug: true // include SMTP traffic in the logs
    },
    {
        from: 'Testbox <andristestbox@gmail.com>',
        headers: {
            'X-Laziness-level': 1000 // just an example header, no need to use this
        }
    }
);

console.log('SMTP Configured');

let message = {
    to: 'Andris Reinman <andris.reinman@gmail.com>',
    subject: 'Nodemailer is unicode friendly ✔ #', //
    text: 'Hello to myself!',
    html:
        '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
        '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>',
    watchHtml: '<b>Hello</b> to myself',
    attachments: [
        {
            filename: 'notes.txt',
            content: 'Some notes about this e-mail',
            contentType: 'text/plain' // optional, would be detected from the filename
        },
        {
            filename: 'image.png',
            content: Buffer.from(
                'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
                    '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
                    'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
                'base64'
            ),

            cid: 'note@example.com' // should be as unique as possible
        },
        {
            filename: 'nyan cat ✔.gif',
            path: __dirname + '/assets/nyan.gif',
            cid: 'nyan@example.com' // should be as unique as possible
        }
    ]
};

console.log('Sending Mail');
transporter.sendMail(message, (error, info) => {
    if (error) {
        console.log('Error occurred');
        console.log(error.message);
        return;
    }
    console.log('Message sent successfully!');
    console.log('Server responded with "%s"', info.response);
    transporter.close();
});
