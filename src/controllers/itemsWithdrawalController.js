const moment = require('moment');
const stockItemsQuery = require('../queries/stockItemsQuery');
const itemsWithdrawalQuery = require('../queries/itemsWithdrawalQuery');

const getitemsWithdrawal = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const itemsWithdrawal = await itemsWithdrawalQuery.getitemsWithdrawal();
    const items = await stockItemsQuery.getItems();
    res.render('itemsWithdrawal', {
      user: req.session.user.email,
      title: 'Retirada de Item',
      itemsw: itemsWithdrawal,
      moment,
      items: items,
    });
  } else if (req.session.user && req.session.user.role === 'user') {
    const itemsWithdrawal = await itemsWithdrawalQuery.getitemsWithdrawal();
    const items = await stockItemsQuery.getItems();
    res.render('itemsWithdrawal', {
      us: req.session.user.email,
      title: 'Retirada de Item',
      itemsw: itemsWithdrawal,
      moment,
      items: items,
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const additemsWithdrawal = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const iditems = req.body.items;
    const { receiver } = req.body;
    const { amount } = req.body;
    const nameitemsWithdrawal = await stockItemsQuery.getName(iditems);
    const input = req.session.user.email;
    const codeitemsWithdrawal = await stockItemsQuery.getCode(iditems);

    const stockk = await stockItemsQuery.getStock(iditems);
    const newStock = parseInt(stockk, 10) - parseInt(amount, 10);

    if (newStock < 0) {
      const itemsWithdrawal = await itemsWithdrawalQuery.getitemsWithdrawal();
      const items = await stockItemsQuery.getItems();
      res.render('itemsWithdrawal', {
        user: req.session.user.email,
        title: 'Retirada de Item',
        itemsw: itemsWithdrawal,
        moment,
        error: 'Add retirada de item failed: insufficient stock items.',
        items: items,
      });
    } else {
      await stockItemsQuery.updateStock(newStock, iditems);
      await itemsWithdrawalQuery.additemsWithdrawal(
        iditems,
        receiver,
        amount,
        nameitemsWithdrawal,
        input,
        codeitemsWithdrawal,
      );

      res.redirect('/itemsWithdrawal');
    }
  } else if (req.session.user && req.session.user.role === 'user') {
    const iditems = req.body.items;
    const { receiver } = req.body;
    const { amount } = req.body;
    const nameitemsWithdrawal = await stockItemsQuery.getName(iditems);
    const input = req.session.user.email;
    const codeitemsWithdrawal = await stockItemsQuery.getCode(iditems);

    const stockk = await stockItemsQuery.getStock(iditems);
    const newStock = parseInt(stockk, 10) - parseInt(amount, 10);

    if (newStock < 0) {
      const itemsWithdrawal = await itemsWithdrawalQuery.getitemsWithdrawal();
      const items = await stockItemsQuery.getItems();
      res.render('itemsWithdrawal', {
        us: req.session.user.email,
        title: 'Retirada de Item',
        itemsw: itemsWithdrawal,
        moment,
        error: 'Add retirada de item failed: insufficient stock items.',
        items: items,
      });
    } else {
      await stockItemsQuery.updateStock(newStock, iditems);
      await itemsWithdrawalQuery.additemsWithdrawal(
        iditems,
        receiver,
        amount,
        nameitemsWithdrawal,
        input,
        codeitemsWithdrawal,
      );

      res.redirect('/itemsWithdrawal');
    }
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const updateitemsWithdrawal = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const { iditems } = req.body;
    const { receiver } = req.body;
    const { amount } = req.body;
    const { idwithdrawal } = req.body;

    const stockk = await stockItemsQuery.getStock(iditems);
    if (stockk !== 'undefined') {
      const currentamounty = await itemsWithdrawalQuery.getAmount(idwithdrawal);

      const amounty = parseInt(amount, 10);
      const currentamount = parseInt(currentamounty, 10);

      if (amounty > currentamount) {
        const selisih = amounty - currentamount;
        const kurangin = stockk - selisih;
        if (kurangin < 0) {
          const itemsWithdrawal = await itemsWithdrawalQuery.getitemsWithdrawal();
          const items = await stockItemsQuery.getItems();
          res.render('itemsWithdrawal', {
            user: req.session.user.email,
            title: 'Retirada de Item',
            itemsw: itemsWithdrawal,
            moment,
            error: 'Edit withdrawal items failed: increasing the amount of out items will cause the item stock value to become negative.',
            items: items,
          });
        } else {
          await stockItemsQuery.updateStock(kurangin, iditems);
          await itemsWithdrawalQuery.updateitemsWithdrawal(receiver, amount, idwithdrawal);
          res.redirect('/itemsWithdrawal');
        }
      } else {
        const selisih = currentamount - amounty;
        const tambahin = stockk + selisih;
        await stockItemsQuery.updateStock(tambahin, iditems);
        await itemsWithdrawalQuery.updateitemsWithdrawal(receiver, amount, idwithdrawal);
        res.redirect('/itemsWithdrawal');
      }
    } else {
      await itemsWithdrawalQuery.updateitemsWithdrawal(receiver, amount, idwithdrawal);
      res.redirect('/itemsWithdrawal');
    }
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const deleteitemsWithdrawal = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const { iditems } = req.body;
    const { amount } = req.body;
    const { idwithdrawal } = req.body;

    const stockk = await stockItemsQuery.getStock(iditems);
    if (stockk !== 'undefined') {
      const amounty = parseInt(amount, 10);
      const stocke = parseInt(stockk, 10);

      const selisih = stocke + amounty;

      await stockItemsQuery.updateStock(selisih, iditems);
      await itemsWithdrawalQuery.delitemsWithdrawal(idwithdrawal);

      res.redirect('/itemsWithdrawal');
    } else {
      await itemsWithdrawalQuery.delitemsWithdrawal(idwithdrawal);

      res.redirect('/itemsWithdrawal');
    }
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

module.exports = {
  getitemsWithdrawal,
  additemsWithdrawal,
  updateitemsWithdrawal,
  deleteitemsWithdrawal,
};
