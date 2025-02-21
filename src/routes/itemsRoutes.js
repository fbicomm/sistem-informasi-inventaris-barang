const express = require('express');

const router = express.Router();
const {
  getItems, getItemsDetail, addItems, updateItems, deleteItems,
} = require('../controllers/itemsController');

router.get('/items', getItems);
router.get('/items/:id', getItemsDetail);
router.post('/items', addItems);
router.put('/items/update/:id', updateItems);
router.post('/items/delete/:id', deleteItems);

module.exports = router;
