const Users = require('../models/Users');
const asyncHandler = require('../middleware/async');
const nodemailer = require('nodemailer');
const randomatic = require('randomatic');


exports.forgotSendOtp = asyncHandler(async (req, res) => {

    const email = req.body.email;
    if (email) {
      const otp = generateOtp(); 
      let testAccount = await nodemailer.createTestAccount();

      let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'roberto.schultz22@ethereal.email',
          pass: '5SSvMW2AZ2Kz89vDJH',
        },
      });
  
      const mailOptions = {
        from: 'roberto.schultz22@ethereal.email',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is: ${otp}`,
      };
  
      console.log("heee", mailOptions); 
  
      transporter.sendMail(mailOptions).then((info) => {
          return res.status(201).json({ status: 'success', message: 'OTP sent successfully', info: info.messageId });
        })
        .catch((error) => {
          console.error('Error sending OTP:', error);
          res.status(500).json({ status: 'error', message: 'Failed to send OTP' });
        });
    } else {
      res.status(400).json({ status: 'error', message: 'Invalid email address' });
    }
})
function generateOtp() {
  return randomatic('0', 6);
}