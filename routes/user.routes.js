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
    updateLocation,
    getAttendanceWithLocation,
    fetchMonthlyAttendance
} = require('../controllers/attendanceLocationController');

const { 
    createSalary, 
    updateSalary, 
    listSalaries, 
    createSalarySlip,
    getSalarySlips,
    getSalaryMonthsByUser

     } = require('../controllers/salaryController');

const { updatePassword  } = require('../controllers/updatePasswordController');


const authenticateToken = require('../middlewares/authMiddleware');

//user or employee
router.post('/employees/add', registerUser);
router.post('/employees/login', loginUser); 
router.post('/employees/update-password', updatePassword); 
router.get('/employees/list', getUserList); 

//shops
router.post('/shop/add', createShop);
router.get('/shops', authenticateToken, getAllShopsByRole); 
//sales
router.post('/sales/add', saleCreate);
router.get('/sales/list', getSale);
router.get('/sales/bar-report', getSalesBarChartReport);
//schemes
router.post('/schemes/add', createScheme);
router.get('/schemes/list', listSchemes);
//visits
router.post('/visits/add', visitCreate);
router.get('/visits/list', getVisitList);
//attendance and location 
router.post('/start-attendance', startAttendance);
router.post('/stop-attendance', stopAttendance);
router.post('/update-location', updateLocation);
router.get('/attendances', getAttendanceWithLocation);
router.get('/attendances/monthly', fetchMonthlyAttendance);
//mater table
router.post('/employees/create', createEmployeeType); 
//holidays
router.post('/holidays/add', createHoliday);
router.get('/holidays/list', getHolidays);
router.delete('/holidays/delete/:id', deleteHoliday);

//salary slip with excel
router.post('/salary-slips/add', createSalarySlip);
router.get('/salary/slip-list', getSalarySlips);
router.get('/salary-slips/by-months', getSalaryMonthsByUser);

//salary 
router.post('/salaries/add', createSalary);
router.put('/salaries/update/:salary_id', updateSalary);
router.get('/salaries/list/slip', listSalaries);



module.exports = router;