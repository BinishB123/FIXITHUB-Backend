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
        const userExist = await userModel.findOne({ email: email })
        console.log(userExist);
        if (!userExist) {
            return false

        } else {
            return true
        }
    }

    async otpverification(email: string, otp: string): Promise<boolean> {
        const otpverifed = await otpModel.findOne({ otp: otp, email: email })
        console.log("otpverfied", otpverifed);

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

        // Check if the user was created successfully
        if (userCreated) {
            return { user: user, created: true }
        } else {
            return { user: user, created: false };
        }
    }

    async signin(userData: userSignIn): Promise<{ user?: userResponseData; success: boolean; message?:string}> {
        // Find the user by email
       
        
        const findedUser = await userModel.findOne({ email: userData.email });
    

        // Check if user exists
        if (!findedUser) {
            return { success: false , message:"incorrect email"}
        }


        const passwordMatch = await bcrypt.compare(userData.password, findedUser.password);
        if (!passwordMatch) {
           return {success:false,message:"password is incorrect"}
        }

        // Construct the user response data
        const user: userResponseData = {
            id: findedUser._id.toString(),
            name: findedUser.name,
            email: findedUser.email,
            mobile: findedUser.mobile + "",
            blocked: findedUser.blocked
        };

        // Return the user data and success status
        return { user: user, success: true };
    }


}

export default UserRepository

