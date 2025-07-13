import nodemailer from "nodemailer";

/**
 * Nodemailer transporter instance
 *
 * Uses Ethereal SMTP for testing/development
 */
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "rey.grady@ethereal.email",
    pass: "XVXY773NZMzd8E4zyX",
  },
});

/**
 * Sends an email using Nodemailer
 *
 * @param {string} to - Recipient's email address
 * @param {string} subject - Email subject
 * @param {string} htmlMessage - HTML content of the email
 * @returns {Promise<object>} - Returns the info object returned by Nodemailer
 */
const sendEmail = async (to, subject, htmlMessage) => {
  return await transporter.sendMail({
    from: '"MernAuth" <ellen35@ethereal.email>',
    to,
    subject,
    html: htmlMessage,
  });
};

export default sendEmail;
