

interface  IAdminInteractor{
     signIn(email:string,password:string):Promise<{success:boolean,message?:string,accessToken?:string,refreshToken?:string}>
}

export default IAdminInteractor