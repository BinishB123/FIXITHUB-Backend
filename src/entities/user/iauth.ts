



interface IuserauthInteractor{
    sendotp(email:string | null):Promise<{success:boolean,message:string}>
}

export default IuserauthInteractor