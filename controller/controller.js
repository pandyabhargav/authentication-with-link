const bcrypt = require('bcrypt');
const User = require('../config/mongose'); 
const passport = require('../config/passport');

const saltRounds = 10; 

// Render the home page
const defaultCon = async (req, res) => {
  console.log("defaultCon");
  if (req.isAuthenticated()) {
    console.log("Returning user. Showing home page.");
    console.log(req.user.name);
    
    return res.render('index', { userName: req.user.name });
  }
  
  console.log("First-time visitor. Showing signup page.");
  return res.render('singup');
};

// Render the signup form
const signupForm = (req, res) => {
  res.render("singup", { error: null });
};

// Handle the signup process
const handleSignup = async (req, res) => {
  const { name, email, password, conf_password } = req.body;

  if (password !== conf_password) {
      req.flash('error_msg', 'Passwords do not match');
      return res.redirect('/singup');
  }

  try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new User({ name, email, password: hashedPassword });

      await newUser.save();
      req.flash('success_msg', 'You have successfully signed up! You can log in now.');
      return res.redirect('/login');
  } catch (error) {
      if (error.code === 11000) {
          req.flash('error_msg', 'Email is already registered');
      } else {
          req.flash('error_msg', 'An error occurred during signup. Please try again.');
      }
      return res.redirect('/singup');
  }
};

// Render the login form
const loginForm = (req, res) => {
  res.render('login');
};

// Handle the login process
const handleLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error_msg', info.message);
      console.log(info.message);
       // Flash the error message
      return res.redirect('/login'); // Redirect back to the login page
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success_msg', 'You have successfully logged in!');
      return res.redirect('/');
    });
  })(req, res, next);
};

// Handle user logout
const handleLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    console.log("User logged out. Redirecting to login.");
    res.redirect('/login');
  });
};

// Render the change password form
const changepassForm = (req, res) => {
  res.render('changepass');
};

// Handle the password change
const changepass = async (req, res) => {
  const { current_password, new_password } = req.body;

  if (req.user) {
    try {
      const passwordMatch = await bcrypt.compare(current_password, req.user.password);
      if (passwordMatch) {
        console.log('Password match');
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);
        await User.updateOne({ _id: req.user._id }, { password: hashedPassword });
        console.log("Password updated");

        req.flash('success_msg', 'Password updated successfully.');
        res.redirect('/login');
      } else {
        console.log('Password does not match');
        req.flash('error_msg', 'Current password is incorrect.');
        res.redirect('/changepass');
      }
    } catch (err) {
      console.error("Error during password change:", err);
      req.flash('error_msg', 'An error occurred while updating the password.');
      res.redirect('/changepass');
    }
  } else {
    req.flash('error_msg', 'User not authenticated.');
    res.redirect('/changepass');
  }
};

module.exports = { 
  defaultCon, 
  signupForm, 
  handleSignup, 
  loginForm, 
  handleLogin, 
  handleLogout, 
  changepass, 
  changepassForm 
};
