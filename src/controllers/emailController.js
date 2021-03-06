const credentials = require('../utils/getCredentials');
const { google } = require('googleapis');
let nodemailer = require('nodemailer');

const OAuth2 = google.auth.OAuth2;

module.exports = async function postEmail(req, res, next) {

    console.log('new POST');

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

    const OAuth2Client = new OAuth2(
        credentials.clientId,
        credentials.clientSecret,
        credentials.redirectUrl
    );

    OAuth2Client.setCredentials({
        refresh_token: credentials.refreshToken
    });

    const accessToken = await OAuth2Client.getAccessToken();

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'oauth2',
            user: credentials.user,
            pass: credentials.pass,
            clientId: credentials.clientId,
            clientSecret: credentials.clientSecret,
            refreshToken: credentials.refreshToken,
            accessToken: accessToken
        }
    });

    transporter.verify((error, success) => {
        if(error) {
            console.log('error verifying');
            next(error);
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
                    console.log('error sending');
                    next(err);
                } else {
                    res.json(data).sendStatus(200);
                    next();
                }
            });
        }
    })
}
