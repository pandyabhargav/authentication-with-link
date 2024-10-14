const express = require('express');
const commentRoutes = express.Router();
const commentController = require('../controller/comentcon');
const isAuthenticated = require('../Modules/isAuth');

// Route to add a comment
commentRoutes.post('/:id/comments', isAuthenticated, commentController.addComment);

// Route to get comments for a specific blog post (optional)
commentRoutes.get('/:id/comments', commentController.getComments);

module.exports = commentRoutes;
