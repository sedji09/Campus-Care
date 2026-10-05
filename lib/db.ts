import mysql from 'mysql2/promise';

export function getDbConfig(): mysql.ConnectionOptions {
	const host = process.env.DB_HOST;
	const isTiDB = Boolean(host && host.includes('tidbcloud.com'));
	const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : (isTiDB ? 4000 : 3306);
	const requiresSsl = process.env.DB_SSL === 'true' || isTiDB;

	return {
		host,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME || 'test',
		port,
		ssl: requiresSsl
			? {
					minVersion: 'TLSv1.2',
					rejectUnauthorized: true,
			  }
			: undefined,
		connectTimeout: 20000,
	};
}

export const createConnection = async () => {
	try {
		const config = getDbConfig();
		const connection = await mysql.createConnection(config);
		return connection;
	} catch (error) {
		console.error('Error connecting to the database:', error);
		throw error;
	}
};

export const createPool = () => {
	try {
		const config = getDbConfig();
		const pool = mysql.createPool(config);
		console.log('Database pool created successfully');
		return pool;
	} catch (error) {
		console.error('Error creating database pool:', error);
		throw error;
	}
};