import providerModel from "../../framework/mongoose/providerSchema";
import otpModel from "../../framework/mongoose/otpSchema";
import IProviderRepository from "entities/irepositeries/iProviderRepo";



class ProviderRepository implements IProviderRepository {
    async sendOtp(otp: string, email: string): Promise<{ created: boolean; }> {
        try {
            const newOtp = await otpModel.create({
                userEmail: email,
                otp: otp
            })
            if (newOtp) {
                return { created: true }
            }

            return { created: false }


        } catch (error) {
            return { created: false }
        }
    }

    async providerExist(email: string) {
        try {
            const exist = await providerModel.findOne({ email: email })
            if (exist) {
                return true
            }
            return false
        } catch (error) {
            return true
        }
    }

    async verifyOtp(email: string, otp: string): Promise<boolean | null> {
        try {
            const otpIsThereOrSame = await otpModel.findOne({ userEmail: email, otp: otp })
            if (!otpIsThereOrSame) {
                return false
            }
            return true
        } catch (error) {
            return false
        }
    }


}


export default ProviderRepository