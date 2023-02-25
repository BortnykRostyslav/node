const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('node:path');


const {NO_REPLY_EMAIL, NO_REPLY_EMAIL_PASS, FRONTEND_URL, SENDGRID_API_KEY} = require('../configs/variables');
const templatesInfo = require('../emailTemplates');
const { ServerError } = require('../errors/ApiError');

const sendMail =  (receiverEmail, emailType, context = {}) => {
    context = context || {};
    const templateConfig = templatesInfo[emailType];

    if(!templateConfig){
        throw new ServerError('Wrong template name');
    }

    Object.assign(context, { frontendURL: FRONTEND_URL });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: NO_REPLY_EMAIL,
            pass: NO_REPLY_EMAIL_PASS,
        },
    });

    const options = {
        extName: '.hbs',
        viewPath: path.join(global.rootPath, 'emailTemplates', 'views'),
        viewEngine:{
            defaultLayout: 'main',
            layoutsDir: path.join(global.rootPath, 'emailTemplates', 'layouts'),
            partialsDir: path.join(global.rootPath, 'emailTemplates', 'partials'),
            extname: '.hbs'
        }
    };

    transporter.use('compile', hbs(options));

    return transporter.sendMail({
        from: 'No reply Rocket2',
        to: receiverEmail,
        subject: templateConfig.subject,
        template: templateConfig.templateName,
        context
    });
};

// const sendSGMail = (receiverEmail, emailType, context = {}) => {
//     context = context || {};
//
//     const templateConfig = templatesInfo[emailType];
//
//     if(!templateConfig){
//         throw new ServerError('Wrong template name');
//     }
//
//     Object.assign(context, { frontendURL: FRONTEND_URL });
//
//     sgMail.setApiKey(SENDGRID_API_KEY);
//
//     sgMail.send({
//         to: receiverEmail,
//         from: 'bortnikrostislav370@gmail.com',
//         subject: templateConfig.subject,
//         text: 'HELLO WORD',
//         html: '<h1>HELLO WORD</h1>'
//     });
// };

module.exports = {
    sendMail,
    // sendSGMail
};