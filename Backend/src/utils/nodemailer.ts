import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export const sendEmail = async (to: string, subject: string, templateName: string, replacements: Record<string, string>) => {
  const templatePath = path.join(__dirname, '..', 'templates', templateName);
  let html = fs.readFileSync(templatePath, 'utf-8');

 
  for (const [key, value] of Object.entries(replacements)) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  console.log(process.env.MAIL_USER,process.env.MAIL_PASS,replacements)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};
