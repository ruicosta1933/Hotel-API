const nodemailer = require("nodemailer");
const config = require("../config");


const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: config.MAIL_FROM,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log(error, "Email not sent");
  }
};

module.exports  = sendEmail