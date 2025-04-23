const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');
const { createShop } = require('../controllers/shopController');
const { saleCreate } = require('../controllers/saleController');
const { createScheme } = require('../controllers/schemeController');
const { visitCreate } = require('../controllers/visitController');
const { handleAttendanceAndLocation } = require('../controllers/attendanceLocationController');

router.post('/users/register', registerUser);
router.post('/shop/create', createShop);
router.post('/sales/create', saleCreate);
router.post('/schemes/create', createScheme);
router.post('/visits/create', visitCreate);
router.post('/attendance-location', handleAttendanceAndLocation);


module.exports = router;