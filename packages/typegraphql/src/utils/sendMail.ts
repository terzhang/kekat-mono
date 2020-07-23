import { account } from '../env/mail';

const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
export async function sendMail(email: string, url: string) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    // Gmail SMTP server: https://support.google.com/a/answer/176600?hl=en
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.username, // generated ethereal user
      pass: account.password, // generated ethereal password
    },
  });

  // send mail with defined transport object and get back info
  const mailOptions = {
    from: '"Kekat 👻" <type@kekat.com>', // sender address
    to: email, // list of receivers
    subject: 'Confirm your email ✔', // Subject line
    text: 'Confirm using this link, ' + url, // plain text body
    html: `<p>Confirm your email <a href="${url}">here</a></p>
      <br/><a href=${url}>${url}</a>`, // html body
  };
  /* const info =  */ await transporter.sendMail(mailOptions);

  // console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// async..await is not allowed in global scope, must use a wrapper
export async function sendTestMail(email: string, url: string) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object and get back info
  const mailOptions = {
    from: '"typegraphql 👻" <type@graphql.com>', // sender address
    to: email, // list of receivers
    subject: 'Confirm your email ✔', // Subject line
    text: 'Confirm using this link, ' + url, // plain text body
    html: `<p>Confirm your email <a href="${url}">here</a></p>
      <br/><a href=${url}>${url}</a>`, // html body
  };
  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
