import  { user, userResponseData, userSignIn } from "../rules/user"




interface IuserauthInteractor{
    sendotp(email:string | null):Promise<{success:boolean,message:string}>
    verifyAndSignup(userData:user,otp:string):Promise<{user?:Object,success:boolean,message:string,acessToken?:string|undefined,refreshToken?:string|undefined}>
    signin(userData:userSignIn):Promise<{user?:userResponseData ,success:boolean ,message?:string,accesToken?:string,refreshToken?:string}>
}

export default IuserauthInteractor   