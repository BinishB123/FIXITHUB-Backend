import IuserauthInteractor from "../../entities/user/iauth";
import isUserRepository from "../../entities/irepositeries/iUserRepository";
import { Imailer } from "../../entities/services/mailer";



class UserAuthInteractor implements IuserauthInteractor {
    constructor(private readonly userRepository: isUserRepository, private readonly Mailer: Imailer) {
    }
    async sendotp(email: string): Promise<{ success: boolean; message: string; }> {
        //checking user already exist with this email 
        const userExist = await this.userRepository.userexist(email)
       
        
        if (!userExist) {
            const mailresponse = await this.Mailer.sendMail(email)
            await this.userRepository.tempOTp(mailresponse.otp, email)
            if (mailresponse.success) {
                return { success: true, message: "Otp send to your email" }
            } else {
                return { success: false, message: "Something went wrong ,cannot send otp to your email" }
            }

        } else {
            return { success: false, message: "user already exists with same email" }
        }
    }

}


export default UserAuthInteractor