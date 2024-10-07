import { user, userResponseData, userSignIn } from "entities/rules/user";
import isUserRepository from "../../entities/irepositeries/iUserRepository";
import otpModel from "../../framework/mongoose/otpSchema";
import userModel from "../../framework/mongoose/userSchema";
import bcrypt from 'bcrypt'




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
        
        const userExist = await userModel.findOne({ email: email.trim() })
       
        if (!userExist) {
            return false

        } else {
            return true
        }
    }

    async otpverification(email: string, otp: string): Promise<boolean> {
        const otpverifed = await otpModel.findOne({ otp: otp, email: email })

        if (otpverifed !== null) {
            return true
        } else {
            return false
        }
    }

    
    // creating the user after otp verification
    async signup(userData: user): Promise<{ user: userResponseData, created: boolean }> {
       
        
        const saltRounds: number = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        const userCreated = await userModel.create({
            name: userData.name,
            mobile: userData.mobile,
            email: userData.email,
            password: hashedPassword,
            blocked: false
        });
        const user = {
            id: userCreated._id + "",
            name: userCreated.name,
            email: userCreated.email,
            mobile: userCreated.mobile + "",
            blocked: userCreated.blocked
        }

        if (userCreated) {
            return { user: user, created: true }
        } else {
            return { user: user, created: false };
        }
    }


    async signin(userData: userSignIn): Promise<{ user?: userResponseData; success: boolean; message?: string }> {
        const findedUser = await userModel.findOne({ email: userData.email.trim() });
        
        if (!findedUser) {
            return { success: false, message: "incorrect email" }
        }
        const passwordMatch = await bcrypt.compare(userData.password, findedUser.password);
        if (!passwordMatch) {
            return { success: false, message: "password is incorrect" }
        }
        if(findedUser.blocked){
            return { success: false, message: "Access denied. Your account is blocked" };
        }
        
        const user: userResponseData = {
            id: findedUser._id.toString(),
            name: findedUser.name,
            email: findedUser.email,
            mobile: findedUser.mobile + "",
            blocked: findedUser.blocked
        };

        return { user: user, success: true };
    }


}

export default UserRepository

