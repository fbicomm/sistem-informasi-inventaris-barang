const pool = require('../database/connect');

const getItems = async () => {
	const query = {
		text: 'SELECT * FROM public.stock ORDER BY iditems',
		values: [],
	};

	const result = await pool.query(query);
	return result.rows;
};

const verifyCode = async (codeitems) => {
	const query = {
		text: 'SELECT codeitems FROM public.stock WHERE LOWER(codeitems) = $1',
		values: [codeitems],
	};

	const result = await pool.query(query);

	if (!result.rowCount) {
		return undefined;
	}

	return result.rows[0].codeitems;
};

const verifyItems = async (nameitems) => {
	const query = {
		text: 'SELECT nameitems FROM public.stock WHERE LOWER(nameitems) = $1',
		values: [nameitems],
	};

	const result = await pool.query(query);

	if (!result.rowCount) {
		return undefined;
	}

	return result.rows[0].nameitems;
};

const addItems = async (
	nameitems,
	description,
	stock,
	image,
	input,
	codeitems,
) => {
	const query = {
		text: 'INSERT INTO public.stock(nameitems, description, stock, image, input, codeitems) VALUES ($1, $2, $3, $4, $5, $6)',
		values: [nameitems, description, stock, image, input, codeitems],
	};

	await pool.query(query);
};

const getImage = async (id) => {
	const query = {
		text: 'SELECT image FROM public.stock WHERE iditems = $1',
		values: [id],
	};

	const result = await pool.query(query);
	return result.rows[0].image;
};

const delItems = async (id) => {
	const query = {
		text: 'DELETE FROM public.stock WHERE iditems = $1',
		values: [id],
	};

	await pool.query(query);
};

const getDetail = async (id) => {
	const query = {
		text: 'SELECT * FROM public.stock WHERE iditems = $1',
		values: [id],
	};

	const result = await pool.query(query);
	return result.rows[0];
};

const updateItems = async (
	nameitems,
	description,
	stock,
	image,
	codeitems,
	iditems,
) => {
	const query = {
		text: 'UPDATE public.stock SET nameitems = $1, description = $2, stock = $3, image = $4, codeitems = $5 WHERE iditems = $6',
		values: [nameitems, description, stock, image, codeitems, iditems],
	};

	await pool.query(query);
};

const getStock = async (id) => {
	const query = {
		text: 'SELECT * FROM public.stock WHERE iditems = $1',
		values: [id],
	};

	const result = await pool.query(query);

	if (!result.rowCount) {
		return 'undefined';
	}

	return result.rows[0].stock;
};

const updateStock = async (newStock, iditems) => {
	const query = {
		text: 'UPDATE public.stock SET stock = $1 WHERE iditems = $2',
		values: [newStock, iditems],
	};

	await pool.query(query);
};

const checkCodeDuplicate = async (codeitems) => {
	const query = {
		text: 'SELECT * FROM public.stock WHERE LOWER(codeitems) = $1',
		values: [codeitems],
	};

	const result = await pool.query(query);
	return result.rows[0];
};

const checkDuplicate = async (nameitems) => {
	const query = {
		text: 'SELECT * FROM public.stock WHERE LOWER(nameitems) = $1',
		values: [nameitems],
	};

	const result = await pool.query(query);
	return result.rows[0];
};

const getCode = async (id) => {
	const query = {
		text: 'SELECT codeitems FROM public.stock WHERE iditems = $1',
		values: [id],
	};

	const result = await pool.query(query);
	return result.rows[0].codeitems;
};

const getName = async (id) => {
	const query = {
		text: 'SELECT nameitems FROM public.stock WHERE iditems = $1',
		values: [id],
	};

	const result = await pool.query(query);
	return result.rows[0].nameitems;
};

const totalStock = async () => {
	const query = {
		text: 'SELECT SUM(stock) FROM stock',
		values: [],
	};

	const result = await pool.query(query);
	return result.rows[0].sum;
};

module.exports = {
	getItems,
	verifyCode,
	verifyItems,
	addItems,
	getImage,
	delItems,
	getDetail,
	updateItems,
	getStock,
	updateStock,
	checkCodeDuplicate,
	checkDuplicate,
	getCode,
	getName,
	totalStock,
};
