



interface IProviderAuthInteractor {
    sendOtp(email:string):Promise<{created:boolean,message?:string}>
    verify(email:string,otp:string):Promise<{success:boolean,message?:string}>
}

export default IProviderAuthInteractor