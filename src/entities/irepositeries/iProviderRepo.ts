


interface IProviderRepository {
    sendOtp(otp:string,email:string):Promise<{created:boolean}>
    providerExist(email:string):Promise<boolean|null>
    verifyOtp(otp:string,email:string):Promise<boolean|null>
}

export default IProviderRepository