import path from 'path'
import nodemailer from 'nodemailer'
import Email from 'email-templates'
import {fileURLToPath} from "url";
import fs from "fs";
import handlebars from "handlebars";

export const _transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})

export const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    }
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const template = (fileName) => {
    const templatePath = path.join(__dirname, '..', 'templates', fileName)
    const templateFile = fs.readFileSync(templatePath, 'utf-8');

    return handlebars.compile(templateFile);
}
