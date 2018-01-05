/**
 * Module dependencies
 */
const appConfig = require('../app.config');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const xoauth2 = require('xoauth2');
// const bunyan = require('bunyan');

// const smtpTransport = require('nodemailer-smtp-transport');
// const EmailTemplates = require('swig-email-templates');

// generator.on('token', function(token) {
//     console.log('New token for %s: %s', token.user, token.accessToken);
// });
// let logger = bunyan.createLogger({
//     name: 'nodemailer'
// });
// logger.level('trace');

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
	function createMailTransport() {
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
		// mailTransport.use('stream', function(mail, callback){
		//     let addresses = mail.message.getAddresses();
		//     console.log('From: %s', JSON.stringify(addresses.from));
		//     console.log('To: %s', JSON.stringify(addresses.to));
		//     console.log('Cc: %s', JSON.stringify(addresses.cc));
		//     console.log('Bcc: %s', JSON.stringify(addresses.bcc));
		//     callback();
		// });
		return mailTransport;
	};

	function logMailTransport(transport) {
		transport.use('stream', function(mail, callback){
		    let addresses = mail.message.getAddresses();
		    console.log('From: %s', JSON.stringify(addresses.from));
		    console.log('To: %s', JSON.stringify(addresses.to));
		    console.log('Cc: %s', JSON.stringify(addresses.cc));
		    console.log('Bcc: %s', JSON.stringify(addresses.bcc));
		    callback();
		});
	};

	function createMailTransport2() {
		let mailTransport = nodemailer.createTransport(
		{
			host: credentials.mail.smtp.host,
			secure: credentials.mail.smtp.secure,
			port: credentials.mail.smtp.port,
			auth: {
		        xoauth2: xoauth2.createXOAuth2Generator({
		            user: credentials.mail.smtp.xoauth.user,
		            clientId: credentials.mail.smtp.xoauth.clientId,
		            clientSecret: credentials.mail.smtp.xoauth.clientSecret,
		            refreshToken: credentials.mail.smtp.xoauth.refreshToken,
		            accessToken: credentials.mail.smtp.xoauth.accessToken,
		            expires: credentials.mail.smtp.xoauth.expires,
		        }),
		    },
			logger: false,
		    debug: true,
		});
		return mailTransport;
	};

	function verifyMSAStatus(transport) {
		transport.verify(function(error, success) {
			if (error) {
				return console.log(error);
			}
			console.log('MSA is ready');
		});
	};

	function createMessage(data) {
		return {
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
	};

	function errorHandler(error, info) {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: %s', info.messageId);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		console.log('Server responded with "%s"', info.response);
	};

	return {
		send: function(data) {
			let mailTransport = createMailTransport();
			verifyMSAStatus(mailTransport);
			logMailTransport(mailTransport);
			let message = createMessage(data);
			mailTransport.sendMail(message, errorHandler);
			mailTransport.close();
		},
		sendList: function(dataList) {
			let mailTransport = createMailTransport();
			verifyMSAStatus(mailTransport);
			logMailTransport(mailTransport);
			mailTransport.on('idle', function() {
				while(mailTransport.isIdle() && dataList.length) {
					this.send(dataList.shift());
				}
			});
		},
		sendError: function(data) {
			// var body = '<h1>' + data.header + '</h1>' +
			// 		   'message: <br><pre>' + data.message + '</pre><br>';
			// if(data.exception) {
			// 	body += 'exception: <br><pre>' + data.exception + '</pre><br>';
			// }
			// if(data.filename) {
			// 	body += 'filename: <br><pre>' + data.filename + '</pre><br>';
			// }
			let mailTransport = createMailTransport();
			verifyMSAStatus(mailTransport);
			logMailTransport(mailTransport);
			var templates = new EmailTemplates(path.join(__dirname, appConfig.email.location));
			var teplateRender = mailTransport.templateSender({
			    render: function(context, callback)
			    {
					templates.render(appConfig.email.errorTemplate, context, function(err, html, text) {
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

			let message = createMessage(data);
			teplateRender(message, data.templateContext, errorHandler);
			mailTransport.close();
		},
		sendTemplate: function(data) {
			let mailTransport = createMailTransport();
			verifyMSAStatus(mailTransport);
			logMailTransport(mailTransport);
			var templates = new EmailTemplates(path.join(__dirname, appConfig.email.location));
			var teplateRender = mailTransport.templateSender({
			    render: function(context, callback)
			    {
					templates.render(appConfig.email.template, context, function(err, html, text) {
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

			let message = createMessage(data);
			teplateRender(message, data.templateContext, errorHandler);
			mailTransport.close();
		},
	};
};