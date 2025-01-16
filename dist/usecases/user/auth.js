"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorInstance_1 = __importDefault(require("../../framework/services/errorInstance"));
class UserAuthInteractor {
    constructor(userRepository, Mailer, jwtServices) {
        this.userRepository = userRepository;
        this.Mailer = Mailer;
        this.jwtServices = jwtServices;
    }
    async sendotp(email) {
        const userExist = await this.userRepository.userexist(email);
        if (!userExist) {
            const mailresponse = await this.Mailer.sendMail(email);
            await this.userRepository.tempOTp(mailresponse.otp + "", email);
            if (mailresponse.success) {
                return { success: true, message: "Otp send to your email" };
            }
            else {
                return {
                    success: false,
                    message: "Something went wrong ,cannot send otp to your email",
                };
            }
        }
        else {
            return { success: false, message: "user already exists with same email" };
        }
    }
    async verifyAndSignup(userData, otp) {
        const otpverified = await this.userRepository.otpverification(userData.email, otp);
        if (!otpverified) {
            return { success: false, message: "Inavlid otp" };
        }
        const signup = await this.userRepository.signup(userData);
        if (!signup.created) {
            return { success: false, message: "Signup failed try again" };
        }
        const acessToken = this.jwtServices.generateToken({ id: signup.user.id, email: userData.email, role: "user" }, { expiresIn: "1h" });
        const refreshToken = this.jwtServices.generateRefreshToken({ id: signup.user.id, email: userData.email, role: "user" }, { expiresIn: "1d" });
        return {
            user: signup.user,
            success: true,
            message: "Signup successfull",
            acessToken: acessToken,
            refreshToken: refreshToken,
        };
    }
    async signin(userData) {
        const response = await this.userRepository.signin(userData);
        if (!response.success) {
            if (response.message === "incorrect email" ||
                response.message === "password is incorrect") {
                return {
                    success: false,
                    message: "Invalid email or password. Please try again.",
                };
            }
            if (response.message === "Access denied. Your account is blocked") {
                return { success: false, message: response.message };
            }
        }
        const acessToken = this.jwtServices.generateToken({ id: response.user?.id, email: userData.email, role: "user" }, { expiresIn: "1hr" });
        const refreshToken = this.jwtServices.generateRefreshToken({ id: response.user?.id, email: userData.email, role: "user" }, { expiresIn: "1d" });
        const respons = this.jwtServices.verifyjwt(refreshToken);
        return {
            user: response.user,
            success: response.success,
            message: response.message,
            accesToken: acessToken,
            refreshToken: refreshToken,
        };
    }
    async checker(id) {
        try {
            const response = await this.userRepository.checker(id);
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode, error.reasons);
        }
    }
    async getBrands() {
        try {
            const response = await this.userRepository.getBrands();
            return response;
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode, error.reasons);
        }
    }
}
exports.default = UserAuthInteractor;
