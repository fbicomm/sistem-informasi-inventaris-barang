const usersQuery = require('../queries/usersQuery');
const stockItemsQuery = require('../queries/stockItemsQuery');
const itemsIncomingQuery = require('../queries/itemsIncomingQuery');
const itemsWithdrawalQuery = require('../queries/itemsWithdrawalQuery');

const getIndex = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const totalStock = await stockItemsQuery.totalStock();
    const totalamountII = await itemsIncomingQuery.totalAmount();
    const totalamountIW = await itemsWithdrawalQuery.totalAmount();
    const totalUsers = await usersQuery.totalUsers();
    res.render('index', {
      user: req.session.user.email,
      title: 'Geral',
      totalStock,
      totalamountII,
      totalamountIW,
      totalUsers,
    });
  } else if (req.session.user && req.session.user.role === 'user') {
    const totalStock = await stockItemsQuery.totalStock();
    const totalamountII = await itemsIncomingQuery.totalAmount();
    const totalamountIW = await itemsWithdrawalQuery.totalAmount();
    const totalUsers = await usersQuery.totalUsers();
    res.render('index', {
      us: req.session.user.email,
      title: 'Geral',
      totalStock,
      totalamountII,
      totalamountIW,
      totalUsers,
    });
  } else {
    res.render('login', { title: 'Login' });
  }
};

module.exports = getIndex;
