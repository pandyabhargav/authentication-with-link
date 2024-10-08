

const User = require('../config/mongose'); // Ensure correct path
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pandyabhargav707@gmail.com', // Use environment variable for sensitive info
    pass: 'kqxredzkmtmonszj', // Use environment variable for sensitive info
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
    } else {
      console.log('Forgot password link sent successfully:', info.response);
    }
  });
};

const forgotpaForm = (req, res) => {
  res.render('forgetForm');
};

const linkedsennt =(req,res)=>{
  res.render('linksend');
}

const requestPasswordReset = async (req, res) => {
  const { useremail } = req.body;

  if (!useremail) {
    return res.status(400).send("User email is required");
  }

  try {
    const user = await User.findOne({ email: useremail });

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = token; // Corrected field name
      await user.save();

      console.log(`User found: ${user.email}, Token: ${token}`); // Corrected template literal syntax
      sendForgotPasswordLink(useremail, token);
      console.log(`Forgot password link sent to ${useremail}`); // Corrected template literal syntax
    } else {
      console.error(`No user found with email: ${useremail}`); // Corrected template literal syntax
    }

   res.render('linksend',{ useremail });
  } catch (error) {
    console.error("Error while generating forgot password link:", error);
    return res.status(500).send("Internal server error");
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
  linkedsennt
};
