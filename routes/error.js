const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');
const Util = require('../utilities');

router.get('/intentional-error', Util.handleErrors(errorController.generateError));

module.exports = router;
