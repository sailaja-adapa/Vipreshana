const nodemailer = require('nodemailer');
const Configs = require('../configs/Configs');

const sendMail = async (data, callback) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: Configs.EMAIL_ADDRESS,
            pass: Configs.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: Configs.EMAIL_ADDRESS,
        to: data.to,
        subject: data.subject,
        html: data.html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            callback(error, null);
        } else {
            callback(null, info.response);
        }
    });
}

module.exports = sendMail;