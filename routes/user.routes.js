const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserList } = require('../controllers/userController');
const { createShop, getAllShopsByRole } = require('../controllers/shopController');
const { saleCreate, getSale, getSalesBarChartReport } = require('../controllers/saleController');
const { createScheme, listSchemes } = require('../controllers/schemeController');
const { visitCreate, getVisitList } = require('../controllers/visitController');
const { createEmployeeType  } = require('../controllers/employeeTypeController');
const { createHoliday, getHolidays, deleteHoliday  } = require('../controllers/holidayController');
const { 
    startAttendance,
    stopAttendance, 
    updateLocation 
} = require('../controllers/attendanceLocationController');

const { createSalary, updateSalary, listSalaries  } = require('../controllers/salaryController');
const { updatePassword  } = require('../controllers/updatePasswordController');


const authenticateToken = require('../middlewares/authMiddleware');

router.post('/employees/add', registerUser);
router.post('/employees/login', loginUser); 
router.post('/employees/update-password', updatePassword); 
router.get('/employees/list', getUserList); 
router.post('/shop/add', createShop);
router.get('/shops', authenticateToken, getAllShopsByRole); 
router.post('/sales/add', saleCreate);
router.get('/sales/list', getSale);
router.get('/sales/bar-report', getSalesBarChartReport);
router.post('/schemes/add', createScheme);
router.get('/schemes/list', listSchemes);
router.post('/visits/add', visitCreate);
router.get('/visits/list', getVisitList);
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