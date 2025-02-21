const express = require('express');

const router = express.Router();
const {
  getitemsIncoming, additemsIncoming, updateitemsIncoming, deleteitemsIncoming,
} = require('../controllers/itemsIncomingController');

router.get('/itemsIncoming', getitemsIncoming);
router.post('/itemsIncoming', additemsIncoming);
router.put('/itemsIncoming/update/:id', updateitemsIncoming);
router.post('/itemsIncoming/delete/:id', deleteitemsIncoming);

module.exports = router;
