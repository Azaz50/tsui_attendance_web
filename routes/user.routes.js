const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');
const { createShop } = require('../controllers/shopController');

router.post('/shop/create', createShop);
router.post('/users/register', registerUser);


module.exports = router;
