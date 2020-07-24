import { account } from '../env/mail';

const nodemailer = require('nodemailer');

type MailOptions = {
  from?: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

// async..await is not allowed in global scope, must use a wrapper
export async function sendMail(options: MailOptions) {
  // reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.username,
      pass: account.password,
    },
  });

  const { from, to, subject, text, html } = options;

  // send mail with defined transport object and get back info
  const mailOptions = {
    from: from ? from : '"Kekat 👻" <info@kekat.com>', // sender address
    to,
    subject,
    text,
    html,
  };
  await transporter.sendMail(mailOptions);
}

export const sendConfirmationEmail = (email: string, url: string) =>
  sendMail({
    to: email,
    subject: 'Confirm your email', // Subject line
    text: 'Confirm using this link, ' + url, // plain text body
    html: `<p>Confirm your email <a href="${url}">here</a></p>
    <br/><a href=${url}>${url}</a>`, // html body
  });

export const sendForgotPasswordEmail = (email: string, url: string) =>
  sendMail({
    to: email,
    subject: 'Reset your password',
    text: 'Reset your password here, ' + url,
    html: `<p>Reset your password <a href="${url}">here</a></p>
    <br/><a href=${url}>${url}</a>`, // html body
  });
