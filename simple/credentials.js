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
		smtp:
		{
			from: '"AR" <alexander.rogalsky@yandex.ru',
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
		poolConfig:
		{
			from: '"AR" <alexander.rogalsky@yandex.ru',
		    pool: true,
		    host: 'smtp.yandex.ru',
		    port: 465,
		    secure: true,
		    auth: {
		        user: 'user@gmail.com',
		        pass: 'pass',
		    },
		    //proxy: 'http://localhost:3128/',
		},
	},
};