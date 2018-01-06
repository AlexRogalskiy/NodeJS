/**
 * Credential properties
 */
module.exports =
{
	cookie:
	{
		key: 'cookieSecret',
		maxAge: 60000000,
	},
	session:
	{
		key: 'sessionSecret',
		maxAge: 60000000,
	},
	mail:
	{
		errorTo: '"AR" <alexander.rogalsky@yandex.ru',
		smtp:
		{
			from: '"AR" <alexander.rogalsky@yandex.ru',
			host: 'smtp.yandex.ru',
			port: 465,
			secure: true,
			auth:
			{
				user: 'user@gmail.com',
				pass: 'password',
			},
			xoauth:
			{
				user: 'user@gmail.com',
				clientId: '{Client ID}',
				clientSecret: '{Client Secret}',
				refreshToken: '{refresh-token}',
				accessToken: '{cached access token}',
				expires: 12345,
			},
			//proxy: 'http://localhost:3128/',
		},
		poolConfig:
		{
			pool: true,
			from: '"AR" <user@gmail.com',
			host: 'smtp.yandex.ru',
			port: 465,
			secure: true,
			auth:
			{
				user: 'user@gmail.com',
				pass: 'pass',
			},
			//proxy: 'http://localhost:3128/',
		},
	},
};