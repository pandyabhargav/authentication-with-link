const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const router = require('./Router/router');
const blogrouter = require('./Router/blogroutes');
const passwordRoute = require('./Router/changepssRout');
const path = require('path');
const mongoose = require('./config/mongose')
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const topicRoute = require('./Router/topicRoutes');
const subTop = require('./Router/SubTopicRoute');
const commentRoutes = require('./Router/comentRoute');




// Use methodOverride for forms with _method input






const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname , 'views')));
// Serve static files from the "css" directory
app.use('/css', express.static(path.join(__dirname, 'css')));




app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'yourSecret', // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
  });

app.use('/',router,blogrouter,passwordRoute,topicRoute,subTop);
app.use('/blogs', commentRoutes);





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
