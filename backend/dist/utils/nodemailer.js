"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sendEmail = async (to, subject, templateName, replacements) => {
    try {
        // Resolve template path - works in both development and production
        // Strategy: Check multiple possible locations
        let templatePath = null;
        // 1. Try dist/templates (production build location)
        const distPath = path_1.default.join(__dirname, '..', 'templates', templateName);
        if (fs_1.default.existsSync(distPath)) {
            templatePath = distPath;
        }
        // 2. Try src/templates (development or if templates copied to src in dist)
        if (!templatePath) {
            const srcPath = path_1.default.join(__dirname, '..', '..', 'src', 'templates', templateName);
            if (fs_1.default.existsSync(srcPath)) {
                templatePath = srcPath;
            }
        }
        // 3. Try from project root (for production deployments)
        if (!templatePath) {
            const rootPath = path_1.default.resolve(process.cwd(), 'src', 'templates', templateName);
            if (fs_1.default.existsSync(rootPath)) {
                templatePath = rootPath;
            }
        }
        // 4. Try dist/templates from project root
        if (!templatePath) {
            const distRootPath = path_1.default.resolve(process.cwd(), 'dist', 'templates', templateName);
            if (fs_1.default.existsSync(distRootPath)) {
                templatePath = distRootPath;
            }
        }
        // 5. Try Render deployment structure: /opt/render/project/src/backend/src/templates
        if (!templatePath) {
            const renderPath = path_1.default.resolve(process.cwd(), 'src', 'templates', templateName);
            if (fs_1.default.existsSync(renderPath)) {
                templatePath = renderPath;
            }
        }
        // 6. Try Render deployment structure from project root
        if (!templatePath) {
            const renderRootPath = path_1.default.resolve(process.cwd(), '..', 'src', 'templates', templateName);
            if (fs_1.default.existsSync(renderRootPath)) {
                templatePath = renderRootPath;
            }
        }
        // 7. Final fallback - try relative to current working directory
        if (!templatePath) {
            const cwdPath = path_1.default.join(process.cwd(), 'backend', 'src', 'templates', templateName);
            if (fs_1.default.existsSync(cwdPath)) {
                templatePath = cwdPath;
            }
        }
        if (!templatePath || !fs_1.default.existsSync(templatePath)) {
            const errorMsg = `Template file not found: ${templateName}. 
Searched locations:
- ${path_1.default.join(__dirname, '..', 'templates', templateName)}
- ${path_1.default.join(__dirname, '..', '..', 'src', 'templates', templateName)}
- ${path_1.default.resolve(process.cwd(), 'src', 'templates', templateName)}
- ${path_1.default.resolve(process.cwd(), 'dist', 'templates', templateName)}
Current working directory: ${process.cwd()}
__dirname: ${__dirname}`;
            throw new Error(errorMsg);
        }
        let html = fs_1.default.readFileSync(templatePath, 'utf-8');
        for (const [key, value] of Object.entries(replacements)) {
            html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        console.log(process.env.MAIL_USER, process.env.MAIL_PASS, replacements);
        const transporter = nodemailer_1.default.createTransport({
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
    }
    catch (error) {
        console.error("❌ Email Error:", error.message);
        throw error;
    }
};
exports.sendEmail = sendEmail;
