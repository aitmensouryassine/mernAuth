import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "neal1@ethereal.email",
    pass: "veCke2TfQmCgchDdmc",
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
