const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    logout
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', authController.loginUser);
router.post('/logout', logout);

module.exports = router;
