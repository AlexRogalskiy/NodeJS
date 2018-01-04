/**
 * Module dependencies
 */
var credentials = require('../credentials');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
// var smtpTransport = require('nodemailer-smtp-transport');

generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});

module.exports.send = function(data) {
	nodemailer.createTestAccount((err, account) => {
		if (err) {
	        return console.log(error);
	    }

		let mailTransport = nodemailer.createTransport(
		{
			host: credentials.mail.smtp.host,
			secure: credentials.mail.smtp.secure,
			port: credentials.mail.smtp.port,
			auth:
			{
		        xoauth2: xoauth2.createXOAuth2Generator({
		            user: credentials.mail.smtp.auth.user,
		            clientId: '{Client ID}',
		            clientSecret: '{Client Secret}',
		            refreshToken: '{refresh-token}',
		            accessToken: '{cached access token}'
		        });
		    },
			logger: false,
	        debug: true,
		},
		{
			from: credentials.mail.smtp.from,
			headers: data.headers ||
			{
				'x-processed': 'a really long',
				'x-unprocessed':
				{
		            prepared: true,
		            value: 'a really long header or value with non-ascii characters 👮'
		        },
				'X-Laziness-level': 1000,
			}
	    });

		mailTransport.verify(function(error, success) {
			if (error) {
				return console.log(error);
			}
			console.log('MSA is ready');
		});

	    mailTransport.use('stream', function(mail, callback){
		    var addresses = mail.message.getAddresses();
		    console.log('From: %s', JSON.stringify(addresses.from));
		    console.log('To: %s', JSON.stringify(addresses.to));
		    console.log('Cc: %s', JSON.stringify(addresses.cc));
		    console.log('Bcc: %s', JSON.stringify(addresses.bcc));
		    callback();
		});

	    let message =
	    {
	        to: data.to,
	     	// envelope: {
		    //     from: data.from,
		    //     to: data.to,
		    // },
	        subject: data.subject,
	        text: data.text,
	        html: data.html,
	        attachments: data.attachments ||
	        [
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
	                cid: 'note@example.com'
	            },
	            {
		            filename: 'text2.txt',
		            content: new Buffer('hello world!','utf-8')
		        },
	            {
		            filename: 'text1.txt',
		            content: 'aGVsbG8gd29ybGQh',
		            encoding: 'base64'
		        },
		        {
		            path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
		        },
	         //    {   // stream as an attachment 
		        //     filename: 'text4.txt',
		        //     content: fs.createReadStream('file.txt')
		        // },
	            // {
	            //     filename: 'nyan cat ✔.gif',
	            //     path: __dirname + '/assets/nyan.gif',
	            //     cid: 'nyan@example.com'
	            // }
	        ],
	        alternatives: [
		        {
		            contentType: 'text/x-web-markdown',
		            content: '**Hello world!**'
		        }
		    ],
	    };

	    mailTransport.sendMail(message, (error, info) =>
	    {
	        if (error) {
	            return console.log(error);
	        }
	        console.log('Message sent: %s', info.messageId);
	    	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	    	mailTransport.close();
		});
	});
};

// var EmailTemplates = require('swig-email-templates');
// var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
 
// // create template renderer 
// var templates = new EmailTemplates();
 
// // provide custom rendering function 
// var sendPwdReminder = transporter.templateSender({
//     render: function(context, callback){
//         templates.render('pwreminder.html', context, function (err, html, text) {
//             if(err){
//                 return callback(err);
//             }
//             callback(null, {
//                 html: html,
//                 text: text
//             });
//         });
//     }
// });