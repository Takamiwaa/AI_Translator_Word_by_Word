const express = require('express');
const router = express.Router();
const { getHistoryList, getHistoryItem, deleteHistoryItem } = require('../controllers/historyController');

router.get('/', getHistoryList);
router.get('/:id', getHistoryItem);
router.delete('/:id', deleteHistoryItem);

module.exports = router;
