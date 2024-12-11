import { SelectedService } from "../../entities/user/IuserResponse"


interface IStripe {
    userCheckoutSession(initailAmountToPay:number):Promise<{success?:boolean,sessionid?:string,url?:string}>
    retrieveSession(sessionId:string):Promise<{success?:boolean,paymentInentID?:string}>
    refund(payemnt_IntendId:string,amount:number):Promise<{success?:boolean}>
    fullpayment(selectedServices:SelectedService[],docId:string):Promise<{success?:boolean,url?:string}>
}

export default IStripe