

interface IStripe {
    userCheckoutSession():Promise<{success?:boolean,sessionid?:string,url?:string}>
    retrieveSession(sessionId:string):Promise<{success?:boolean,paymentInentID?:string}>
}

export default IStripe