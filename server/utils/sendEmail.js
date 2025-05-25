const nodemailer = require("nodemailer")

const sendEmail = async (options) => {
  // Configure transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  // Add HTML if provided
  if (options.html) {
    mailOptions.html = options.html
  }

  // Send email
  const info = await transporter.sendMail(mailOptions)

  return info
}

module.exports = sendEmail
