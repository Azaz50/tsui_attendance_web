const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserList } = require('../controllers/userController');
const { createShop, getShop } = require('../controllers/shopController');
const { saleCreate, getSale } = require('../controllers/saleController');
const { createScheme } = require('../controllers/schemeController');
const { visitCreate } = require('../controllers/visitController');
const { createEmployeeType  } = require('../controllers/employeeTypeController');
const { 
    startAttendance, 
    stopAttendance, 
    updateLocation 
} = require('../controllers/attendanceLocationController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/employees/add', registerUser);
router.post('/employees/login', loginUser); 
router.post('/employees/list', getUserList); 
router.post('/shop/add', createShop);
router.get('/shops', authenticateToken, getShop); 
router.post('/sales/add', saleCreate);
router.get('/sales/list', getSale);
router.post('/schemes/add', createScheme);
router.post('/visits/add', visitCreate);
router.post('/start-attendance', startAttendance);
router.post('/stop-attendance', stopAttendance);
router.post('/update-location', updateLocation);
router.post('/employees/create', createEmployeeType); 



module.exports = router;