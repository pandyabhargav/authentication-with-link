const express = require('express');
const subTop = express.Router();
const controller = require('../controller/subTopic');
const isAuthenticated = require('../Modules/isAuth');


subTop.get('/addSubtopic', isAuthenticated, controller.addSubtopicForm); 
subTop.post('/addSubtopic', isAuthenticated, controller.addSubtopic); 




module.exports = subTop;
