/**
 * Module dependencies
 */
var appConfig = require('../app.config');
var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');
// var smtpTransport = require('nodemailer-smtp-transport');
// var EmailTemplates = require('swig-email-templates');

const DEFAULT_MAIL_GENERATE_TEXT_FROM_HTML = false;

const DEFAULT_MAIL_HEADERS =
{
	'x-processed': 'a really long',
	'x-unprocessed':
	{
		prepared: true,
		value: 'a really long header or value with non-ascii characters 👮'
	},
	'X-Laziness-level': 1000,
};

const DEFAULT_MAIL_ATTACHMENTS =
[
	{
		filename: 'notes.txt',
		content: 'Some notes about this e-mail',
		contentType: 'text/plain' // optional, would be detected from the filename
	},
	{
		filename: 'image.png',
		content: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
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
	{
		filename: 'map.jpg',
		content: fs.createReadStream(path.join(path.dirname(__dirname), appConfig.email.location, '/map.jpg')),
	},
	{
		filename: 'map2.jpg',
		path: path.join(path.dirname(__dirname), appConfig.email.location, '/map.jpg'),
		cid: 'nyan@example.com'
	},
];

const DEFAULT_MAIL_ALTERNATIVES =
[
	{
		contentType: 'text/x-web-markdown',
		content: '**Hello world!**'
	},
];

module.exports = function(credentials)
{
	let mailTransport = nodemailer.createTransport(
	{
		host: credentials.mail.smtp.host,
		secure: credentials.mail.smtp.secure,
		port: credentials.mail.smtp.port,
		auth: {
			user: credentials.mail.smtp.auth.user,
			pass: credentials.mail.smtp.auth.pass,
		},
		logger: false,
	    debug: true,
	});

	mailTransport.use('stream', function(mail, callback){
	    var addresses = mail.message.getAddresses();
	    console.log('From: %s', JSON.stringify(addresses.from));
	    console.log('To: %s', JSON.stringify(addresses.to));
	    console.log('Cc: %s', JSON.stringify(addresses.cc));
	    console.log('Bcc: %s', JSON.stringify(addresses.bcc));
	    callback();
	});

	return {
		send: function(data) {
			mailTransport.verify(function(error, success) {
				if (error) {
					return console.log(error);
				}
				console.log('MSA is ready');
			});

			// var messages = [...'list of messages'];
			// mailTransport.on('idle', function() {
			// 	while(mailTransport.isIdle() && messages.length) {
			// 		mailTransport.send(messages.shift());
			// 	}
			// });

			let message =
			{
				from: data.from || credentials.mail.smtp.from,
				to: data.to,
				// envelope: {
				//     from: data.from,
				//     to: data.to,
				// },
				subject: data.subject,
				text: data.text,
				html: data.html,
				generateTextFromHtml: data.generateTextFromHtml || DEFAULT_MAIL_GENERATE_TEXT_FROM_HTML,
				attachments: data.attachments || [],
				alternatives: data.alternatives || [],
				headers: data.headers || {},
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
		},
		sendError: function(data) {
			var body = '<h1>' + data.header + '</h1>' +
					   'message: <br><pre>' + data.message + '</pre><br>';
			if(data.exception) {
				body += 'exception: <br><pre>' + data.exception + '</pre><br>';
			}
			if(data.filename) {
				body += 'filename: <br><pre>' + data.filename + '</pre><br>';
			}

			let message =
			{
				from: data.from || credentials.mail.smtp.from,
				to: data.to || credentials.mail.errorTo,
				// envelope: {
				//     from: data.from,
				//     to: data.to,
				// },
				subject: data.subject,
				text: data.text,
				html: data.html,
				generateTextFromHtml: data.generateTextFromHtml || DEFAULT_MAIL_GENERATE_TEXT_FROM_HTML,
				attachments: data.attachments || [],
				alternatives: data.alternatives || [],
				headers: data.headers || {},
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
		},
		sendTemplate: function(data) {
			var templates = new EmailTemplates();
			var sendPwdReminder = mailTransport.templateSender({
			    render: function(context, callback)
			    {
					templates.render(credentials.mail.template, context, function(err, html, text) {
			            if(error) {
			                return callback(error);
			            }
			            callback(null, { html: html, text: text });
					});
				}
			},
			{
				from: data.from || credentials.mail.smtp.from,
			});

			// // send a message based on provided templates 
			// sendPwdReminder(mailData, context, callback);
			// // or 
			// sendPwdReminder(mailData, context).then(...).catch(...);

			sendPwdReminder({
			    to: data.to,
			    subject: data.subject,
			    //text: data.text,
				//html: data.html,
			},
			{
				data: data.data,
			}, function(error, info) {
				if(error) {
					return console.log(error);
				} else {
					console.log('Password reminder sent');
				}
			});
		},
	};
};