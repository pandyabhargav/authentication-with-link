const User = require('../config/mongose'); // Ensure correct path
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pandyabhargav707@gmail.com', 
    pass: 'kqxredzkmtmonszj',
  },
});

// Function to send the forgot password link email
const sendForgotPasswordLink = (toEmail, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use environment variable
    to: toEmail,
    subject: 'Reset Your Password',
    html: `<b>Click the following link to reset your password:</b><br>
           <a href="http://localhost:3000/forgotPassword/${token}">Reset Password</a>`, // Corrected HTML syntax
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending forgot password link email:', error);
       return; 
    } else {
      console.log('Forgot password link sent successfully:', info.response);
    }
  });
};

const forgotpaForm = (req, res) => {
  // Display the forgot password form and any flash messages
  res.render('forgetForm', { message: req.flash('info') });
};

const requestPasswordReset = async (req, res) => {
  const { useremail } = req.body;

  if (!useremail) {
    return res.status(400).send("User email is required");
  }

  try {
    const user = await User.findOne({ email: useremail });

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = token; 
      await user.save();

      sendForgotPasswordLink(useremail, token);
      req.flash('success_msg', 'A password reset link has been sent to your email address. Please check your inbox (and spam folder).');
    } else {
      req.flash('error_msg', 'No account found with that email address.');
    }

    res.redirect('/forgotform');
  } catch (error) {
    console.error("Error while generating forgot password link:", error);
    req.flash('error_msg', 'Internal server error');
    return res.redirect('/forgotform');
  }
};


const forgotpassForm = (req, res) => {
  const token = req.params.token;
  res.render('forgotpass', { token });
};

// Handle forgot password logic
const forgotpasslogic = async (req, res) => {
  const token = req.params.token;
  console.log(`Token received for validation: ${token}`); // Corrected template literal syntax
  
  const { New_password, conf_password } = req.body;

  if (!token) {
    console.error("Token not provided.");
    return res.redirect('/forgotform');
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token, // Corrected field name
    });

    if (!user) {
      console.error(`No user found for token: ${token}`); // Corrected template literal syntax
      return res.redirect('/forgotform');
    }
    
    if (New_password !== conf_password) {
      console.error("Passwords do not match.");
      return res.redirect(`/forgotPassword/${token}`); // Corrected template literal syntax
    }

    // Hash new password and update user data
    const hashedPassword = await bcrypt.hash(New_password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null; // Clear the reset token
    await user.save();

    console.log(`Password updated for user: ${user.email}`); // Corrected template literal syntax
    return res.redirect('/login');
  } catch (error) {
    console.error("Error updating password:", error);
    return res.redirect(`/forgotPassword/${token}`); // Corrected template literal syntax
  }
};

const linkexpa = (req, res) => {
  res.render("linkexpire");
};

module.exports = {
  forgotpaForm,
  requestPasswordReset,
  forgotpassForm,
  forgotpasslogic,
  linkexpa,
};
