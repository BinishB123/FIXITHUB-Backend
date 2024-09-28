import IProviderAuthInteractor from "../../entities/provider/Iauth";
import IProviderRepository from "../../entities/irepositeries/iProviderRepo";
import { Imailer } from "../../entities/services/mailer";


class ProviderAuthInteractor implements IProviderAuthInteractor {
    constructor(
        private readonly providerAuthRepository: IProviderRepository,
        private readonly Mailer: Imailer
    ) { }

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

    async verify(email: string, otp: string): Promise<{ success: boolean; message?: string; }> {
        try {
            const verifyResponse = await this.providerAuthRepository.verifyOtp(email, otp)
            if (verifyResponse) {
                return { success: true, message: "Email verified " }
            }
            return { success: false, message: "Email verification failed with Otp" }
        } catch (error) {
            return { success: false, message: "An error occurred verification failed" }
        }
    }


}

export default ProviderAuthInteractor;
