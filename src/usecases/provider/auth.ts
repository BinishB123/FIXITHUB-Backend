import IProviderAuthInteractor from "../../entities/provider/Iauth";
import IProviderRepository from "../../entities/irepositeries/iProviderRepo";
import { Imailer } from "../../entities/services/mailer";
import { ProviderRegisterData, RegisterResponse, SigIn, SignResponse } from "entities/rules/provider";
import { Ijwtservices } from "../../entities/services/Ijwt";


class ProviderAuthInteractor implements IProviderAuthInteractor {
    constructor(
        private readonly providerAuthRepository: IProviderRepository,
        private readonly Mailer: Imailer,
        private readonly jwtServices: Ijwtservices

    ) { }
    //this function is for sending the otp to providers email 
    async sendOtp(email: string): Promise<{ created: boolean; message?: string }> {
        try {
            const mailResponse = await this.Mailer.sendMail(email);

            if (!mailResponse.success) {
                return { created: false, message: "Failed to send OTP." };
            }

            const providerExistResponse = await this.providerAuthRepository.providerExist(email);

            if (providerExistResponse) {
                return { created: false, message: "Email already exists." };
            }

            const repositoryResponse = await this.providerAuthRepository.sendOtp(mailResponse.otp, email);

            if (!repositoryResponse.created) {
                return { created: false, message: "Failed to create OTP." };
            }

            return { created: true, message: "OTP sent successfully." };
        } catch (error) {
            return { created: false, message: "An error occurred while sending OTP." };
        }
    }
    // this function is for verify the providers otp
    async verify(email: string, otp: string): Promise<{ success: boolean; message?: string; }> {
        try {
            const verifyResponse = await this.providerAuthRepository.verifyOtp(email, otp)
            if (verifyResponse) {
                return { success: true, message: "Email verified " }
            }
            return { success: false, message: "Invalid otp" }
        } catch (error) {
            return { success: false, message: "An error occurred verification failed" }
        }
    }
    //this function is for provider signup
    async registerProvider(registerdata: ProviderRegisterData): Promise<{ created: boolean; message: string; provider?: RegisterResponse; accessToken?: string; refreshToken?: string; }> {
        try {
        
            const providerCreate = await this.providerAuthRepository.registerProvider(registerdata)
            if (providerCreate.message === "server down") {
                return { created: false, message: providerCreate.message }
            } else if (providerCreate.message === "registration failed" && !providerCreate.created) {
                return { created: false, message: providerCreate.message }
            }
            const accessToken = await this.jwtServices.generateToken({ id: providerCreate.provider?.id, email: registerdata.email, role: "provider" }, { expiresIn: '1h' })
            
            const refreshToken = await this.jwtServices.generateRefreshToken({ id: providerCreate.provider?.id, email: registerdata.email, role: "provider" }, { expiresIn: '1d' })
            return { created: true, message: "created", provider: providerCreate.provider, refreshToken: refreshToken, accessToken: accessToken }

        } catch (error) {
            return { created: false, message: "server down" }
        }
    }

    async signInProvider(providerSignData: SigIn): Promise<{ success: boolean; message: string; provider?: SignResponse, accessToken?: string, refreshToken?: string }> {
        try {
            
            const provider = await this.providerAuthRepository.signInProvider(providerSignData)
            if (!provider.success) {
                return { success: false, message: provider.message }
            }
            const acccessToken = await this.jwtServices.generateToken({id: provider.provider?.id, email: providerSignData.email, role: "provider" }, { expiresIn: '1h' })
            const refreshToken = await this.jwtServices.generateRefreshToken({ id: provider.provider?.id, email: providerSignData.email, role: "provider" }, { expiresIn: '1d' })
            return { success: true, message: provider.message, provider: provider.provider, accessToken: acccessToken, refreshToken: refreshToken }


        } catch (error) {
             return {success:false ,message:"server error"}
        }
    }

}

export default ProviderAuthInteractor;
