const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');



// Routes to render forms
router.get('/', controller.defaultCon);

router.get('/singup',controller.signupForm);
router.get('/login' ,controller.loginForm);

router.post('/singup' ,controller.handleSignup);
router.post('/login' ,controller.handleLogin);

router.get('/logout' ,controller.handleLogout);

// change password routes
router.get('/chagepa',controller.changepassForm);
router.post('/chagepa',controller.changepass);

module.exports = router;
