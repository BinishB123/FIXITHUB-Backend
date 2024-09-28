import { Imailer } from "entities/services/mailer";
import generateRandomOTP from "./generateOtp";
import sendMail from "./sendMail";


class Mailer implements Imailer {
    async sendMail(email: string): Promise<{ otp: string; success: boolean; }> {
        const otp: string = generateRandomOTP()
       const response =  await sendMail(email, otp) 
       return {otp:otp,success:response.success}
    }
}

export default Mailer