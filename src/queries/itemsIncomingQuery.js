const pool = require('../database/connect');

const getDetail = async (id) => {
	const query = {
		text: 'SELECT * FROM public.incoming WHERE idincoming = $1',
		values: [id],
	};

	const result = await pool.query(query);
	return result.rows[0];
};

const getAmount = async (id) => {
	const query = {
		text: 'SELECT * FROM public.incoming WHERE idincoming = $1',
		values: [id],
	};

	const result = await pool.query(query);
	return result.rows[0].amount;
};

const additemsIncoming = async (
	iditems,
	information,
	amount,
	nameitemsIncoming,
	input,
	codeitemsIncoming,
) => {
	const query = {
		text: 'INSERT INTO public.incoming(iditems, information, amount, nameitems_m, input, codeitems_m) VALUES ($1, $2, $3, $4, $5, $6)',
		values: [iditems, information, amount, nameitemsIncoming, input, codeitemsIncoming],
	};

	await pool.query(query);
};

const updateitemsIncoming = async (information, amount, idincoming) => {
	const query = {
		text: 'UPDATE public.incoming SET information = $1, amount = $2 WHERE idincoming = $3',
		values: [information, amount, idincoming],
	};

	await pool.query(query);
};

const delitemsIncomingId = async (id) => {
	const query = {
		text: 'DELETE FROM public.incoming WHERE iditems = $1',
		values: [id],
	};

	await pool.query(query);
};

const delitemsIncoming = async (idincoming) => {
	const query = {
		text: 'DELETE FROM public.incoming WHERE idincoming = $1',
		values: [idincoming],
	};

	await pool.query(query);
};

const getitemsIncoming = async () => {
	const query = {
		text: 'SELECT * FROM public.incoming ORDER by idincoming DESC',
		values: [],
	};

	const result = await pool.query(query);
	return result.rows;
};

const getDetailItems = async (id) => {
	const query = {
		text: 'SELECT * FROM public.incoming WHERE iditems = $1',
		values: [id],
	};

	const result = await pool.query(query);
	return result.rows;
};

const totalAmount = async () => {
	const query = {
		text: 'SELECT SUM(amount) FROM incoming',
		values: [],
	};

	const result = await pool.query(query);
	return result.rows[0].sum;
};

module.exports = {
	getDetail,
	getAmount,
	additemsIncoming,
	updateitemsIncoming,
	delitemsIncomingId,
	delitemsIncoming,
	getitemsIncoming,
	getDetailItems,
	totalAmount,
};
