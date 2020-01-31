'use strict';
const express = require('express');
const router = express.Router();

const apiRouterController = require('../controllers/api.routing.controller');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.route('/getrouteposition/:startlatitude/:startlongitude/:finishlatitude/:finishlongitude')
    .get(apiRouterController.getRoutePosition);

module.exports = router;