const pool = require('../database/connect');

const getDetail = async (id) => {
	const query = {
		text: 'SELECT * FROM public.withdrawal WHERE idwithdrawal = $1',
		values: [id],
	};

	const result = await pool.query(query);
	return result.rows[0];
};

const getAmount = async (id) => {
	const query = {
		text: 'SELECT * FROM public.withdrawal WHERE idwithdrawal = $1',
		values: [id],
	};

	const result = await pool.query(query);
	return result.rows[0].amount;
};

const additemsWithdrawal = async (
	iditems,
	receiver,
	amount,
	nameitemsWithdrawal,
	input,
	codeitemsWithdrawal,
) => {
	const query = {
		text: 'INSERT INTO public.withdrawal(iditems, receiver, amount, nameitems_k, input, codeitems_k) VALUES ($1, $2, $3, $4, $5, $6)',
		values: [iditems, receiver, amount, nameitemsWithdrawal, input, codeitemsWithdrawal],
	};

	await pool.query(query);
};

const updateitemsWithdrawal = async (receiver, amount, idwithdrawal) => {
	const query = {
		text: 'UPDATE public.withdrawal SET receiver= $1, amount = $2 WHERE idwithdrawal = $3',
		values: [receiver, amount, idwithdrawal],
	};

	await pool.query(query);
};

const delitemsWithdrawalId = async (id) => {
	const query = {
		text: 'DELETE FROM public.withdrawal WHERE iditems = $1',
		values: [id],
	};

	await pool.query(query);
};

const delitemsWithdrawal = async (idwithdrawal) => {
	const query = {
		text: 'DELETE FROM public.withdrawal WHERE idwithdrawal = $1',
		values: [idwithdrawal],
	};

	await pool.query(query);
};

const getitemsWithdrawal = async () => {
	const query = {
		text: 'SELECT * FROM public.withdrawal ORDER BY idwithdrawal DESC',
		values: [],
	};

	const result = await pool.query(query);
	return result.rows;
};

const getDetailItems = async (id) => {
	const query = {
		text: 'SELECT * FROM public.withdrawal WHERE iditems = $1',
		values: [id],
	};

	const result = await pool.query(query);
	return result.rows;
};

const totalAmount = async () => {
	const query = {
		text: 'SELECT SUM(amount) FROM withdrawal',
		values: [],
	};

	const result = await pool.query(query);
	return result.rows[0].sum;
};

module.exports = {
	getDetail,
	getAmount,
	updateitemsWithdrawal,
	additemsWithdrawal,
	delitemsWithdrawalId,
	delitemsWithdrawal,
	getitemsWithdrawal,
	getDetailItems,
	totalAmount,
};
