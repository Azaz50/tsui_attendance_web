const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserList } = require('../controllers/userController');
const { createShop, getShop } = require('../controllers/shopController');
const { saleCreate, getSale } = require('../controllers/saleController');
const { createScheme } = require('../controllers/schemeController');
const { visitCreate } = require('../controllers/visitController');
const { createEmployeeType  } = require('../controllers/employeeTypeController');
const { createHoliday, getHolidays, deleteHoliday  } = require('../controllers/holidayController');
const { 
    startAttendance, 
    stopAttendance, 
    updateLocation 
} = require('../controllers/attendanceLocationController');

const { createSalary, updateSalary, listSalaries  } = require('../controllers/salaryController');


const authenticateToken = require('../middlewares/authMiddleware');

router.post('/employees/add', registerUser);
router.post('/employees/login', loginUser); 
router.get('/employees/list', getUserList); 
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
router.post('/holidays/add', createHoliday);
router.get('/holidays/list', getHolidays);
router.delete('/holidays/delete/:id', deleteHoliday);
router.post('/salary/add', createShop);



router.post('/salaries/add', createSalary);
router.put('/salaries/update/:salary_id', updateSalary);
router.get('/salaries/list/slip', listSalaries);



module.exports = router;