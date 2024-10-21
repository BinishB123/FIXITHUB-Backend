import { ProviderRegisterData ,RegisterResponse} from "../../entities/rules/provider"
import { SigIn,SignResponse } from "../../entities/rules/provider"



interface IProviderAuthInteractor {
    sendOtp(email: string): Promise<{ created: boolean, message?: string }>
    verify(email: string, otp: string): Promise<{ success: boolean, message?: string }>
    registerProvider(registerdata: ProviderRegisterData): Promise<{ created: boolean, message: string, provider?: RegisterResponse ,accessToken?:string,refreshToken?:string }>
    signInProvider(providerSignData:SigIn):Promise<{success:boolean,message:string,provider?:SignResponse ,accessToken?:string,refreshToken?:string}>



}

export default IProviderAuthInteractor