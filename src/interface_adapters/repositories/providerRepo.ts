import providerModel from "../../framework/mongoose/providerSchema";
import otpModel from "../../framework/mongoose/otpSchema";
import IProviderRepository from "entities/irepositeries/iProviderRepo";
import { ProviderRegisterData, RegisterResponse, SigIn, SignResponse } from "entities/rules/provider";
import bcrypt from 'bcrypt'



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
            const saltRounds: number = 10;
            const hashedPassword = await bcrypt.hash(registerdata.password, saltRounds);
            const created = await providerModel.create({
                workshopName: registerdata.workshopName,
                ownerName: registerdata.ownerName,
                email: registerdata.email,
                password: hashedPassword,
                mobile: registerdata.mobile,
                workshopDetails: registerdata.workshopDetails
            })
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

    async signInProvider(providerSignData: SigIn): Promise<{ success: boolean; message: string; provider?: SignResponse; }> {
        try {
            const providerExist = await providerModel.findOne({ email: providerSignData.email })
            if (!providerExist) {
                return { success: false, message: "provider not exist with this email" }
            }
            const passwordMatch = await bcrypt.compare(providerSignData.password, providerExist.password);
            if (!passwordMatch) {
                return { success: false, message: "incorrect password" }
            }
            if (providerExist.requestAccept === false) {
                return { success: false, message: "registration request not accepted" }
            }

            if (providerExist.requestAccept === null) {
                return { success: false, message: "rejected your request" }
            }

            const provider = {
                id: providerExist._id + "",
                ownername: providerExist.ownerName,
                workshopname: providerExist.workshopName,
                email: providerExist.email,
                mobile: providerExist.mobile,
                requested: providerExist.requestAccept,
                blocked: providerExist.blocked
            }
            return { success: true, message: "provider exist", provider: provider }
        } catch (error) {
            return { success: false, message: "server down" }
        }
    }


}


export default ProviderRepository