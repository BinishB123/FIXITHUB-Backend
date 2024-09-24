import isUserRepository from "../../entities/irepositeries/iUserRepository";
import otpModel from "../../framework/mongoose/otpSchema";
import userModel from "../../framework/mongoose/userSchema";



class UserRepository implements isUserRepository {
    // this method is for saving the otp in dbs 
    //temperory otp saving in dbs ttl
    async tempOTp(otp: string, email: string): Promise<{ created: boolean }> {
        const newotp = await otpModel.create({
            userEmail: email,
            otp: otp
        })
        if (newotp) {
            return { created: true }
        }
        return { created: false }
    }
    //this method is for checking the user with given email is exist or not 
    // userexist
    async userexist(email: string): Promise<boolean> {
        const userExist = await userModel.findOne({ email: email })
        console.log(userExist);
        if (!userExist) {
           return false

        }else{
            return true
        }
    }


}

export default UserRepository

