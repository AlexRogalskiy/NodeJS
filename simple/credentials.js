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
		template: 'pwreminder.html',
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
		        pass: 'pass',
		    },
		    //proxy: 'http://localhost:3128/',
		},
		poolConfig:
		{
			pool: true,
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
	},
};