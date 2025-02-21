const pool = require('../database/connect');

const getLog = async () => {
	const query = {
		text: 'SELECT * FROM public.log ORDER BY idlog DESC',
		values: [],
	};

	const result = await pool.query(query);
	return result.rows;
};

const addLog = async (usr, method, endpoint, statusCode) => {
	const query = {
		text: 'INSERT INTO public.log(usr, method, endpoint, status_code) VALUES ($1, $2, $3, $4)',
		values: [usr, method, endpoint, statusCode],
	};

	await pool.query(query);
};

const clearLogs = async () => {
	const query = {
		text: 'DELETE FROM public.log',
		values: [],
	};

	await pool.query(query);
};

module.exports = {
	getLog,
	addLog,
	clearLogs
};
