const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: String(process.env.EMAIL_SECURE) === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail({ to, subject, html, text }) {
  const from = process.env.EMAIL_FROM || "No Reply <noreply@example.com>";
  return transporter.sendMail({ from, to, subject, html, text });
}

function verificationEmailTemplate(link) {
  return `
    <h2>Verify your email</h2>
    <p>Click the link to verify your account:</p>
    <p><a href="${link}">${link}</a></p>
  `;
}

function resetEmailTemplate(link) {
  return `
    <h2>Reset your password</h2>
    <p>Click the link to set a new password:</p>
    <p><a href="${link}">${link}</a></p>
  `;
}

function otpEmailTemplate(code) {
  return `
    <h2>Your OTP Code</h2>
    <p>Use this code to login: <strong>${code}</strong></p>
    <p>It expires in 10 minutes.</p>
  `;
}

module.exports = {
  sendEmail,
  verificationEmailTemplate,
  resetEmailTemplate,
  otpEmailTemplate,
};
