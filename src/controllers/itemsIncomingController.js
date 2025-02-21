const moment = require('moment');
const stockItemsQuery = require('../queries/stockItemsQuery');
const itemsIncomingQuery = require('../queries/itemsIncomingQuery');

const getitemsIncoming = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const itemsIncoming = await itemsIncomingQuery.getitemsIncoming();
    const items = await stockItemsQuery.getItems();
    res.render('itemsIncoming', {
      user: req.session.user.email,
      title: 'Entrada de Item',
      itemsi: itemsIncoming,
      moment,
      items: items,
    });
  } else if (req.session.user && req.session.user.role === 'user') {
    const itemsIncoming = await itemsIncomingQuery.getitemsIncoming();
    const items = await stockItemsQuery.getItems();
    res.render('itemsIncoming', {
      us: req.session.user.email,
      title: 'Entrada de Item',
      itemsi: itemsIncoming,
      moment,
      items: items,
    });
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const additemsIncoming = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const iditems = req.body.items;
    const { information } = req.body;
    const { amount } = req.body;
    const nameitemsIncoming = await stockItemsQuery.getName(iditems);
    const input = req.session.user.email;
    const codeitemsIncoming = await stockItemsQuery.getCode(iditems);

    const stockk = await stockItemsQuery.getStock(iditems);
    const newStock = parseInt(stockk, 10) + parseInt(amount, 10);

    await stockItemsQuery.updateStock(newStock, iditems);
    await itemsIncomingQuery.additemsIncoming(
      iditems,
      information,
      amount,
      nameitemsIncoming,
      input,
      codeitemsIncoming,
    );

    res.redirect('/itemsIncoming');
  } else if (req.session.user && req.session.user.role === 'user') {
    const iditems = req.body.items;
    const { information } = req.body;
    const { amount } = req.body;
    const nameitemsIncoming = await stockItemsQuery.getName(iditems);
    const input = req.session.user.email;
    const codeitemsIncoming = await stockItemsQuery.getCode(iditems);

    const stockk = await stockItemsQuery.getStock(iditems);
    const newStock = parseInt(stockk, 10) + parseInt(amount, 10);

    await stockItemsQuery.updateStock(newStock, iditems);
    await itemsIncomingQuery.additemsIncoming(
      iditems,
      information,
      amount,
      nameitemsIncoming,
      input,
      codeitemsIncoming,
    );

    res.redirect('/itemsIncoming');
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const updateitemsIncoming = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const { iditems } = req.body;
    const { information } = req.body;
    const { amount } = req.body;
    const { idincoming } = req.body;

    const stockk = await stockItemsQuery.getStock(iditems);
    if (stockk !== 'undefined') {
      const currentamountd = await itemsIncomingQuery.getAmount(idincoming);

      const amount = parseInt(amount, 10);
      const currentamount = parseInt(currentamountd, 10);

      if (amount > currentamount) {
        const diff = amount - currentamount;
        const tambahin = stockk + diff;
        await stockItemsQuery.updateStock(tambahin, iditems);
        await itemsIncomingQuery.updateitemsIncoming(information, amount, idincoming);
        res.redirect('/itemsIncoming');
      } else {
        const diff = currentamount - amount;
        const kurangin = stockk - diff;
        if (kurangin < 0) {
          const itemsIncoming = await itemsIncomingQuery.getitemsIncoming();
          const items = await stockItemsQuery.getItems();
          res.render('itemsIncoming', {
            user: req.session.user.email,
            title: 'Entrada de Item',
            itemsi: itemsIncoming,
            moment,
            deleteFail: 'Editing incoming items failed: reducing the amount of incoming items will result in the items stock value becoming negative.',
            items: items,
          });
        } else {
          await stockItemsQuery.updateStock(kurangin, iditems);
          await itemsIncomingQuery.updateitemsIncoming(information, amount, idincoming);
          res.redirect('/itemsIncoming');
        }
      }
    } else {
      await itemsIncomingQuery.updateitemsIncoming(information, amount, idincoming);
      res.redirect('/itemsIncoming');
    }
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

const deleteitemsIncoming = async (req, res) => {
  if (req.session.user && req.session.user.role === 'superadmin') {
    const { iditems } = req.body;
    const { amount } = req.body;
    const { idincoming } = req.body;

    const stockk = await stockItemsQuery.getStock(iditems);
    if (stockk !== 'undefined') {
      const amountd = parseInt(amount, 10);
      const stockk = parseInt(stockk, 10);

      const diff = stock - amountd;

      if (diff < 0) {
        const itemsIncoming = await itemsIncomingQuery.getitemsIncoming();
        const items = await stockItemsQuery.getItems();
        res.render('itemsIncoming', {
          user: req.session.user.email,
          title: 'Entrada de Item',
          itemsi: itemsIncoming,
          moment,
          deleteFail: 'Delete incoming items failed: deleting incoming items will result in the item stock value becoming negative.',
          items: items,
        });
      } else {
        await stockItemsQuery.updateStock(diff, iditems);
        await itemsIncomingQuery.delitemsIncoming(idincoming);

        res.redirect('/itemsIncoming');
      }
    } else {
      await itemsIncomingQuery.delitemsIncoming(idincoming);

      res.redirect('/itemsIncoming');
    }
  } else {
    res.status(401);
    res.render('401', { title: '401 Error' });
  }
};

module.exports = {
  getitemsIncoming,
  additemsIncoming,
  updateitemsIncoming,
  deleteitemsIncoming,
};
