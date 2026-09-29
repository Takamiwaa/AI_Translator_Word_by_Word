const express = require('express');
const router = express.Router();
const { getProviders, getProviderModels, testProviderConnection } = require('../controllers/providersController');

router.get('/', getProviders);
router.get('/:provider/models', getProviderModels);
router.post('/test', testProviderConnection);

module.exports = router;
