import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export const sendEmail = async (to: string, subject: string, templateName: string, replacements: Record<string, string>) => {
  try {
    // Resolve template path - works in both development and production
    // Strategy: Check multiple possible locations
    let templatePath: string | null = null;
    
    // 1. Try dist/templates (production build location)
    const distPath = path.join(__dirname, '..', 'templates', templateName);
    if (fs.existsSync(distPath)) {
      templatePath = distPath;
    }
    
    // 2. Try src/templates (development or if templates copied to src in dist)
    if (!templatePath) {
      const srcPath = path.join(__dirname, '..', '..', 'src', 'templates', templateName);
      if (fs.existsSync(srcPath)) {
        templatePath = srcPath;
      }
    }
    
    // 3. Try from project root (for production deployments)
    if (!templatePath) {
      const rootPath = path.resolve(process.cwd(), 'src', 'templates', templateName);
      if (fs.existsSync(rootPath)) {
        templatePath = rootPath;
      }
    }
    
    // 4. Try dist/templates from project root
    if (!templatePath) {
      const distRootPath = path.resolve(process.cwd(), 'dist', 'templates', templateName);
      if (fs.existsSync(distRootPath)) {
        templatePath = distRootPath;
      }
    }
    
    // 5. Try Render deployment structure: /opt/render/project/src/backend/src/templates
    if (!templatePath) {
      const renderPath = path.resolve(process.cwd(), 'src', 'templates', templateName);
      if (fs.existsSync(renderPath)) {
        templatePath = renderPath;
      }
    }
    
    // 6. Try Render deployment structure from project root
    if (!templatePath) {
      const renderRootPath = path.resolve(process.cwd(), '..', 'src', 'templates', templateName);
      if (fs.existsSync(renderRootPath)) {
        templatePath = renderRootPath;
      }
    }
    
    // 7. Final fallback - try relative to current working directory
    if (!templatePath) {
      const cwdPath = path.join(process.cwd(), 'backend', 'src', 'templates', templateName);
      if (fs.existsSync(cwdPath)) {
        templatePath = cwdPath;
      }
    }
    
    if (!templatePath || !fs.existsSync(templatePath)) {
      const errorMsg = `Template file not found: ${templateName}. 
Searched locations:
- ${path.join(__dirname, '..', 'templates', templateName)}
- ${path.join(__dirname, '..', '..', 'src', 'templates', templateName)}
- ${path.resolve(process.cwd(), 'src', 'templates', templateName)}
- ${path.resolve(process.cwd(), 'dist', 'templates', templateName)}
Current working directory: ${process.cwd()}
__dirname: ${__dirname}`;
      throw new Error(errorMsg);
    }
    
    let html = fs.readFileSync(templatePath, 'utf-8');

    for (const [key, value] of Object.entries(replacements)) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    console.log(process.env.MAIL_USER, process.env.MAIL_PASS, replacements);

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

    console.log("📩 Sending email...");
    const sent = await transporter.sendMail(mailOptions);
    console.log("✔ Email sent successfully:", sent);

    return sent;

  } catch (error: any) {
    console.error("❌ Email Error:", error.message);
    throw error;
  }
};
