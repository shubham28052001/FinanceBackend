const nodemailer = require("nodemailer");
const sendMail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        await transporter.sendMail({
            from:process.env.MAIL_USER,
            to,
            subject,
            html
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports= sendMail;