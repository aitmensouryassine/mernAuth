import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "ellen35@ethereal.email",
    pass: "N76n97DNmBmaeNJjKW",
  },
});

const sendEmail = async (to, subject, htmlMessage) => {
  return await transporter.sendMail({
    from: '"MernAuth" <ellen35@ethereal.email>',
    to,
    subject,
    html: htmlMessage,
  });
};

export default sendEmail;
