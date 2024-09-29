import { RegisterResponse ,ProviderRegisterData } from "../../entities/rules/provider"



interface IProviderRepository {
    sendOtp(otp:string,email:string):Promise<{created:boolean}>
    providerExist(email:string):Promise<boolean|null>
    verifyOtp(otp:string,email:string):Promise<boolean|null>
    registerProvider(registerdata:ProviderRegisterData):Promise<{created:boolean,message:string,provider?:RegisterResponse}>
}

export default IProviderRepository