import mysql from 'mysql2/promise';

const dbConfig: mysql.ConnectionOptions = {
	host: process.env.DB_HOST, 
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env?.DB_PORT ? Number(process.env?.DB_PORT) : 3306,
	ssl: process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com'))
		? { rejectUnauthorized: true }
		: undefined,
};

export const createConnection = async () => {
	try {
		const connection = await mysql.createConnection(dbConfig);
		return connection;
	} catch (error) {
		console.error('Error connecting to the database:', error);
		throw error;
	}
};

export const createPool = () => {
	try {
		const pool = mysql.createPool(dbConfig);
		console.log('Database pool created successfully');
		return pool;
	} catch (error) {
		console.error('Error creating database pool:', error);
		throw error;
	}
};