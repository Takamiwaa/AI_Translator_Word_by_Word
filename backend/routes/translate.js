const express = require('express');
const router = express.Router();
const { handleTranslate } = require('../controllers/translateController');

router.post('/', handleTranslate);

module.exports = router;
