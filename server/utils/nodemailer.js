import path from 'path'
import nodemailer from 'nodemailer'
import {fileURLToPath} from "url";
import fs from "fs";
import handlebars from "handlebars";
import config from "../config.js";

export const transporter = nodemailer.createTransport({
        service: config.MailService,
        host: config.MailHost,
        port: config.MailPort,
        secure: true,
        auth: {
            user: config.MailUser,
            pass: config.MailPassword
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
