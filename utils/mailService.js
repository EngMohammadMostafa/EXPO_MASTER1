// utils/mailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // أو أي SMTP آخر تختاره
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail({ to, subject, text, html = null }) {
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text, html });
}

module.exports = { sendMail };