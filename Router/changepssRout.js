const express = require('express');
const passwordRoute = express.Router();
const controller = require('../controller/changepass');

// Route for forgot password form
passwordRoute.get('/forgotform', controller.forgotpaForm);

// Route for generating and sending the forgot password link
passwordRoute.post('/forgotform', controller.requestPasswordReset); 



passwordRoute.get('/link-expired', controller.linkexpa);

// Change password
passwordRoute.get('/forgotPassword/:token', controller.forgotpassForm);
passwordRoute.post('/forgotPassword/:token', controller.forgotpasslogic);

module.exports = passwordRoute;
