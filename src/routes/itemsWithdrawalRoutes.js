const express = require('express');

const router = express.Router();
const {
  getitemsWithdrawal, additemsWithdrawal, updateitemsWithdrawal, deleteitemsWithdrawal,
} = require('../controllers/itemsWithdrawalController');

router.get('/itemsWithdrawal', getitemsWithdrawal);
router.post('/itemsWithdrawal', additemsWithdrawal);
router.put('/itemsWithdrawal/update/:id', updateitemsWithdrawal);
router.post('/itemsWithdrawal/delete/:id', deleteitemsWithdrawal);

module.exports = router;
