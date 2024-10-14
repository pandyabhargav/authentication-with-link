const express = require('express');
const topicRoute = express.Router();
const controller = require('../controller/Topics');
const isAuthenticated = require('../Modules/isAuth');

topicRoute.get('/addTopics', controller.Addtopics);
topicRoute.post('/addTopics', controller.addNewTopic);
topicRoute.get('/viewTopics',isAuthenticated, controller.viewTopics);
topicRoute.post('/deleteTopic/:id', controller.deleteTopic); // New route for deleting topics


module.exports = topicRoute;
