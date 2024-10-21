import user, { userResponseData, userSignIn } from "entities/rules/user"
import { IgetservicesResponse } from "entities/user/IuserResponse"
import { Types } from "mongoose"


interface isUserRepository{
    tempOTp(otp:string,email:string):Promise<{created:boolean}>
    userexist(email:string):Promise<boolean>
    otpverification(email:string,otp:string):Promise<boolean>
    signup(userData:user):Promise<{user:userResponseData,created:boolean}>
    signin(userData:userSignIn):Promise<{user?:userResponseData,success:boolean,message?:string}>
    getServices(category:string):Promise<{success:boolean,message:string,services?:IgetservicesResponse[]}>


    
}



export default isUserRepository