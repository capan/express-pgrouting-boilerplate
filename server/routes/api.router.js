const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const apiRouterController = require('../controllers/api.routing.controller');


router.use(bodyParser.urlencoded({ extended: true }));
router.route('/getrouteposition/:startlatitude/:startlongitude/:finishlatitude/:finishlongitude')
    .get(apiRouterController.getRoutePosition);

module.exports = router;
