const express = require('express');
const passwordRoute = express.Router();
const controller = require('../controller/changepass');

// Route for forgot password form
passwordRoute.get('/forgotform', controller.forgotpaForm);

// Route for generating and sending the forgot password link
passwordRoute.post('/forgotform', controller.requestPasswordReset); 



passwordRoute.get('/link-expired', controller.linkexpa);
passwordRoute.get('/linksend',controller.linkedsennt)

// Route for OTP form
// passwordRoute.get('/otpForm', controller.otpForm);
// passwordRoute.post('/otpForm/:userId', controller.verifyOTP);

// Change password
passwordRoute.get('/forgotPassword/:token', controller.forgotpassForm);
passwordRoute.post('/forgotPassword/:token', controller.forgotpasslogic);

module.exports = passwordRoute;
