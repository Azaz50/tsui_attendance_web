const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');
const { createShop, getShop } = require('../controllers/shopController');
const { saleCreate } = require('../controllers/saleController');
const { createScheme } = require('../controllers/schemeController');
const { visitCreate } = require('../controllers/visitController');
const { 
    startAttendance, 
    stopAttendance, 
    updateLocation 
} = require('../controllers/attendanceLocationController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/users/register', registerUser);
router.post('/users/login', loginUser); 
router.post('/shop/add', createShop);
router.get('/shops', authenticateToken, getShop); 
router.post('/sales/add', saleCreate);
router.post('/schemes/add', createScheme);
router.post('/visits/add', visitCreate);
router.post('/start-attendance', startAttendance);
router.post('/stop-attendance', stopAttendance);
router.post('/update-location', updateLocation);


module.exports = router;