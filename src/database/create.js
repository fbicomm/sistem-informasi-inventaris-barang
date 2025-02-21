const { Client } = require('pg');
const fs = require('fs');

async function createDb() {
	const client = new Client({
		host: process.env.PGHOST,
		port: process.env.PGPORT,
		user: process.env.PGUSER,
		password: process.env.PGPASSWORD,
		database: "postgres"
	})
	await client.connect()
	
	const databaseName = process.env.PGDATABASE;

	if (process.env.PGOVERWRITE) {
		await client.query(`DROP DATABASE IF EXISTS ${databaseName} WITH (FORCE);`);
	}

	const result = await client.query(`SELECT FROM pg_database WHERE datname = '${databaseName}';`)
	if (result.rows.length === 0) {
		await client.query(`CREATE DATABASE ${databaseName};`);

		const clientd = new Client({
			host: process.env.PGHOST,
			port: process.env.PGPORT,
			user: process.env.PGUSER,
			password: process.env.PGPASSWORD,
			database: databaseName,
		});
		await clientd.connect()

		if (process.env.PGOVERWRITE) {
			await clientd.query(`DROP SCHEMA IF EXISTS public CASCADE;`);
		}

		var sql = fs.readFileSync("src/database/db.sql", "utf8");
		await clientd.query(sql);
		await clientd.end()
	}

	await client.end()
}

module.exports = createDb;