const nodemailer = require('nodemailer');
const Email = require('email-templates');
const { emailConfig } = require('../../../config/variables');
const logger = require('../../../config/logger');

// SMTP is the main transport in Nodemailer for delivering messages.
// SMTP is also the protocol used between almost all email hosts, so its truly universal.
// if you dont want to use SMTP you can create your own transport here
// such as an email service API or nodemailer-sendgrid-transport

const transporter = nodemailer.createTransport({
  port: emailConfig.port,
  host: emailConfig.host,
  auth: {
    user: emailConfig.username,
    pass: emailConfig.password,
  },
  secure: false, // upgrades later with STARTTLS -- change this based on the PORT
});

// verify connection configuration
transporter.verify((error) => {
  if (error) {
    logger.log('error with email connection');
  }
});

exports.sendPasswordReset = async (passwordResetObject) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: 'support@vault.com',
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: 'passwordReset',
      message: {
        to: passwordResetObject.userEmail,
      },
      locals: {
        productName: 'Coffer.io App',
        // passwordResetUrl should be a URL to your app that displays a view where they
        // can enter a new password along with passing the resetToken in the params
        passwordResetUrl: `https://coffer.io/new-password/view?resetToken=${passwordResetObject.resetToken}`,
      },
    })
    .catch(() => logger.log('error sending password reset email'));
};

exports.sendPasswordChangeEmail = async (user) => {
  const email = new Email({
    views: { root: __dirname },
    message: {
      from: 'support@vault.com',
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport: transporter,
  });

  email
    .send({
      template: 'passwordChange',
      message: {
        to: user.email,
      },
      locals: {
        productName: 'Coffer.io',
        name: user.name,
      },
    })
    .catch(() => logger.log('error sending change password email'));
};
