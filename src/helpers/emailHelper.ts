import * as dateFns from 'date-fns';
import * as fs from 'fs-extra';

import pathHelper from './pathHelper';
import config from '../config';

const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;

const emailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

export default {
    sendEmailTemplate
};

interface EmailOptions {
    from: string,
    to: string,
    subject?: string,
    text?: string,
    html?: string
}

async function sendEmailTemplate(templateName: string, data: Object, emailData: EmailOptions) {
    try {
        let response = await renderTemplate(templateName, data);

        emailData.html = response.html;

        if (!emailData.subject) emailData.subject = response.subject;

        if (config.email.useStubs && config.isDevLocal) {
            await sendStubEmail(emailData);
        } else {
            return new Promise((resolve, reject) => {
                emailTransport.sendMail(emailData, function (err, info) {
                    if (err) return reject(err);

                    return resolve(info);
                });
            });
        }
    } catch (err) {
        console.log('Cannot render email template');
    }
}

function renderTemplate(name: string, data: Object): Promise<any> {
    let templateDir = pathHelper.getDataRelative('emails', name);
    let template = new EmailTemplate(templateDir);

    return new Promise<any>((resolve, reject) => {
        template.render(data, function (err, result) {
            if (err) reject(err);

            return resolve(result);
        });
    });
}

function sendEmail(emailOptions: EmailOptions): Promise<Object> {
    return new Promise<Object>((resolve, reject) => {
        emailTransport.sendMail(emailOptions, function (error, info) {
            if (error) return Promise.reject(error);

            return info;
        });
    });
}

async function sendStubEmail(mailOptions) {
    try {
        let { from, to, subject, text, html } = mailOptions;

        let nowDateStr = dateFns.format(new Date(), 'DD-MM_HH-mm-ss');

        let fileName = `${nowDateStr}_${to}_${subject}`;

        let isHtml = !!html;
        let extension = isHtml ? 'html' : 'txt';
        fileName = `${fileName}.${extension}`;

        let emailStubsFolder = pathHelper.getLocalRelative('./emails');

        fs.ensureDirSync(emailStubsFolder);

        let filePath = pathHelper.getLocalRelative('./emails', fileName);

        fs.writeFileSync(filePath, isHtml ? html : text);
    } catch (err) {
        console.log('Cannot send stub email.')
    }
}