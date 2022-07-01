module.exports = ({env}) => ({
	connection: {
		client: 'mysql',
		connection: {
			host: env('DATABASE_HOST', env('DB_HOST')),
			port: env.int('DATABASE_PORT', env('DB_PORT')),
			database: env('DATABASE_NAME', env('DB_NAME')),
			user: env('DATABASE_USERNAME', env('DB_USER')),
			password: env('DATABASE_PASSWORD', env('DB_PASSWORD')),
			ssl: env.bool('DATABASE_SSL', true),
		},
	},
});
