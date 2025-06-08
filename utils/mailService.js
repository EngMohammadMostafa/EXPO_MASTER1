 const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // أو service بريد آخر مثل outlook أو smtp custom
  auth: {
    user: "your_email@gmail.com",
    pass: "your_app_password", // كلمة مرور التطبيق من إعدادات Gmail
  },
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: '"Expo System" <your_email@gmail.com>',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

module.exports = { sendMail };
