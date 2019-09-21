const credentials = require('../utils/getCredentials');
const { google } = require('googleapis');
let nodemailer = require('nodemailer');

const OAuth2 = google.auth.OAuth2;

module.exports = async function postEmail(req, res, next) {
    console.log('POST');

    const name = req.body.name;
    const emailAddress = req.body.emailAddress;
    const phoneNumber = req.body.phoneNumber;
    const message = req.body.message;
    const { emailOpt, phoneOpt, textOpt } = req.body.options;
    const preferredComm = [];
    if(emailOpt) { preferredComm.push('Email') };
    if(phoneOpt) { preferredComm.push('Phone') };
    if(textOpt) { preferredComm.push('Text') };

    const content = `Name: ${name} \n Email: ${emailAddress} \n Phone: ${phoneNumber} \n Message: ${message} \n Preferred Methods of Communication: ${preferredComm.toString()}`;
    console.log('URL: ' + req.originalUrl);
    console.log('Header: ' + JSON.stringify(req.headers));

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: credentials.user,
            pass: credentials.pass,
        }
    });

    transporter.verify((error, success) => {
        if(error) {
            console.log(error);
            return undefined;
        } else {
            const mail = {
                from: credentials.user,
                to: credentials.user,
                subject: 'Contact Request',
                text: content,
                html: `
                <html style="font-family: sans-serif">
                    <div>
                        <h3 style="text-align: center">You have a new contact request.<h2>
                        <hr>
                        <h4><b>Name:</b> ${name}</p>
                        <h4><b>Email:</b> ${emailAddress}</p>
                        <h4><b>Phone Number:</b> ${phoneNumber}</p>
                        <h4><b>Message:</b> ${message}</p>
                        <hr>
                        <h5>Their preffered methods of contact are: ${preferredComm.toString()}</h4>
                    </div>
                </html>
                `
            };

            transporter.sendMail(mail, (err, data) => {
                if(err) {
                    res.json({msg:err}).sendStatus(500);
                } else {
                    res.json({msg:success, data: data}).sendStatus(200);
                    transporter.close();
                }
            });
        }
    })
    next();
}
