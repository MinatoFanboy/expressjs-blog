const express = require('express');
var router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/search', siteController.search);
router.get('/', siteController.index);
router.get('/test', siteController.test);

module.exports = router;
