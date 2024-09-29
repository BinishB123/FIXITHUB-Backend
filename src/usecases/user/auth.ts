import IuserauthInteractor from "../../entities/user/iauth";
import isUserRepository from "../../entities/irepositeries/iUserRepository";
import { Imailer } from "../../entities/services/mailer";
import { Ijwtservices } from "../../entities/services/Ijwt";
import user, { userResponseData, userSignIn } from "entities/rules/user";



class UserAuthInteractor implements IuserauthInteractor {
    constructor(private readonly userRepository: isUserRepository, private readonly Mailer: Imailer, private readonly jwtServices: Ijwtservices) {
    }
    async sendotp(email: string): Promise<{ success: boolean; message: string; }> {
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

    async verifyAndSignup(userData: user, otp: string): Promise<{ user?: Object, success: boolean; message: string; acessToken?: string | undefined; refreshToken?: string | undefined; }> {

        const otpverified = await this.userRepository.otpverification(userData.email, otp)
        if (!otpverified) {
            return { success: false, message: "otp verification failed" }
        }

        const signup = await this.userRepository.signup(userData)
        if (!signup.created) {
            return { success: false, message: "Signup failed try again" }
        }
        const acessToken = this.jwtServices.generateToken({ user: signup.user, email: userData.email }, { expiresIn: '1h' })
        const refreshToken = this.jwtServices.generateRefreshToken({ user: signup.user, email: userData.email }, { expiresIn: '1d' })


        return { user: signup.user, success: true, message: "Signup successfull", acessToken: acessToken, refreshToken: refreshToken }
    }

    async signin(userData: userSignIn): Promise<{ user?: userResponseData; success: boolean; message?: string; accesToken?: string; refreshToken?: string; }> {
        const response = await this.userRepository.signin(userData)
        if (!response.success) {
            if (response.message === "incorrect email") {
                return response
            }
            if (response.message === "password is incorrect") {
                return response
            }
        }
        const acessToken = this.jwtServices.generateToken({ user: response.user, email: userData.email }, { expiresIn: '1h' })
        const refreshToken = this.jwtServices.generateRefreshToken({ user: response.user, email: userData.email }, { expiresIn: '1d' })

        return { user: response.user, success: response.success, message: response.message, accesToken: acessToken, refreshToken: refreshToken }
    }



}


export default UserAuthInteractor