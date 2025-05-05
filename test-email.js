// test-email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'swiftvisaonline2025@gmail.com',
    pass: 'dwhrbjqqluspedbh',
  },
});

const mailOptions = {
  from: '"SwiftVisa" <swiftvisaonline@gmail.com>',
  to: 'oualid.bhd@gmail.com',
  subject: 'Test Email from SwiftVisa App',
  text: 'This is a test email to verify the SMTP settings.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('Error sending email:', error);
  }
  console.log('Email sent:', info.response);
});