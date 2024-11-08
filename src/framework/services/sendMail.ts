import nodemailer from 'nodemailer'
import { Mailer } from '../../entities/services/mailer'
import dotenv from 'dotenv';
dotenv.config();
// send mail using nodemail to user 
const sendMail = async (email: string, otp?: string,subject?:string,text?:string): Promise<{ success: boolean }> => {


    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: Mailer.user,
            pass: Mailer.password,
        },
        tls: {
            rejectUnauthorized: false,
        }
    })
    const info = {
        subject: subject!=undefined?subject:"Signup Verification Mail from FIXITHUB",
        text: otp?`Your OTP is ${otp}. Use this OTP to complete your signup process.`:text
    }

    const mailOptions = {
        from: Mailer.user,
        to: email,
        subject: info.subject,
        text: info.text,
    };
    try {
        const response = await transporter.sendMail(mailOptions)
        return { success: true };
    } catch (error: any) {
        console.log("error message from sending mail in sendmail :", error.message);

        return { success: false }
    }

}

export default sendMail