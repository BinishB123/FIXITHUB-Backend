import dotenv from 'dotenv';
dotenv.config();

export interface Imailer{
    sendMail(email:string):Promise<{otp:string,success:boolean}>
}

interface mailConfig{
    user:string,
    password:string
}

export const Mailer = <mailConfig>{
    user:process.env.email,
    password : process.env.password
} 