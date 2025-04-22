import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    // credentials
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false, // to skip SSL verfication
  },
});
