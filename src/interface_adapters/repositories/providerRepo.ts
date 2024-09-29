import providerModel from "../../framework/mongoose/providerSchema";
import otpModel from "../../framework/mongoose/otpSchema";
import IProviderRepository from "entities/irepositeries/iProviderRepo";
import { ProviderRegisterData, RegisterResponse } from "entities/rules/provider";



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
    async registerProvider(registerdata: ProviderRegisterData): Promise<{ created: boolean; message: string; provider?: RegisterResponse; }> {
        try {
            const created = await providerModel.create(registerdata)
            if (!created) {
                return { created: false, message: "registration failed" }
            }
            const provider = {
                id: created._id + "",
                ownername: created.ownerName,
                workshopname: created.workshopName,
                email: created.email,
                mobile: created.mobile,
                requested: created.requestAccept,
                blocked: created.blocked

            }

            return { created: true, message: "register", provider: provider }

        } catch (error) {
            return { created: false, message: "server down" }
        }
    }


}


export default ProviderRepository