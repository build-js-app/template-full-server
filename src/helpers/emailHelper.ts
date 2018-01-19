import * as dateFns from 'date-fns';
import * as fs from 'fs-extra';
import * as nodemailer from 'nodemailer';

import pathHelper from './pathHelper';
import config from '../config';
import templateRenderer from './templateRenderHelper';

export default {
  sendEmail,
  sendEmailTemplate
};

const emailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'thoughtlet.test@gmail.com',
    pass: 'Password!23'
  }
});

interface EmailOptions {
  from: string;
  to: string;
  subject?: string;
  body?: string;
}

async function sendEmailTemplate(templateName: string, emailData: Object, emailOptions: EmailOptions) {
  try {
    let response = await renderTemplate(templateName, emailData);

    emailOptions.body = response.body;

    if (!emailOptions.subject) emailOptions.subject = response.subject;

    if (config.email.useStubs && config.isDevLocal) {
      await sendStubEmail(emailOptions);
    } else {
      await sendEmail(emailOptions);
    }
  } catch (err) {
    console.log('Cannot render email template');
  }
}

async function renderTemplate(name: string, data: Object): Promise<any> {
  let result = {
    body: null,
    subject: null
  };

  let bodyFileName = pathHelper.getDataRelative('emails', name, 'body.hbs');
  let bodyExists = await fs.pathExists(bodyFileName);

  if (!bodyExists) throw new Error(`Cannot find email template file at ${bodyFileName}`);

  result.body = await templateRenderer.renderTemplate(bodyFileName, data);

  let subjectFileName = pathHelper.getDataRelative('emails', name, 'subject.hbs');
  let subjectExists = await fs.pathExists(bodyFileName);

  if (subjectExists) {
    result.subject = await templateRenderer.renderTemplate(subjectFileName, data);
  }

  return result;
}

function sendEmail(emailData: EmailOptions): Promise<Object> {
  return new Promise<Object>((resolve, reject) => {
    emailTransport.sendMail(emailData, (error, info) => {
      if (error) return Promise.reject(error);

      return info;
    });
  });
}

async function sendStubEmail(mailOptions) {
  try {
    let {from, to, subject, body} = mailOptions;

    let nowDateStr = dateFns.format(new Date(), 'YYYY-MM-DD_HH-mm-ss-x');
    let fileName = `${nowDateStr}_${to}_${subject}.html`;

    let emailStubsFolder = pathHelper.getLocalRelative('./emails');

    fs.ensureDirSync(emailStubsFolder);

    let filePath = pathHelper.getLocalRelative('./emails', fileName);

    fs.writeFileSync(filePath, body);
  } catch (err) {
    console.log('Cannot send stub email.');
  }
}
