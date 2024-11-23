import user, { IRequiredDataDForBooking, Provider, userResponseData, userSignIn } from "entities/rules/user"
import { IgetservicesResponse ,IRequirementToFetchShops} from "entities/user/IuserResponse"
import { ObjectId } from "mongoose"


interface isUserRepository{
    tempOTp(otp:string,email:string):Promise<{created:boolean}>
    userexist(email:string):Promise<boolean>
    otpverification(email:string,otp:string):Promise<boolean>
    signup(userData:user):Promise<{user:userResponseData,created:boolean}>
    signin(userData:userSignIn):Promise<{user?:userResponseData,success:boolean,message?:string}>
    checker(id:string):Promise<{success?:boolean,message?:string}>
    getServices(category:string):Promise<{success:boolean,message:string,services?:IgetservicesResponse[]}>
    getAllBrand():Promise<{success:boolean,message?:string,brandData?:{_id:string,brand:string}[]|null}>
    getAllShops(data:IRequirementToFetchShops):Promise<{success:boolean,message?:string,shops?:any[]}>  
    getshopProfileWithSelectedServices(data:{serviceId:string,vehicleType:string,providerId:string}):Promise<{success:boolean,message?:string,shopDetail?:Provider[]|[],service?:{_id:ObjectId, category:string ,serviceType:string,imageUrl:string,subTypes:{type:string,_id:ObjectId}[]}|any}> 
    userUpdateData(data:{id:string,newData:string,whichToChange:string}):Promise<{success?:boolean,message?:string,newData?:string}> 
    addOrChangePhoto(data:{id:string,url?:string}):Promise<{success?:boolean,message?:string,url?:string}>
    getBookingDates(id:string):Promise<{success?:boolean,data?:{_id:ObjectId, date:Date,count:number}[]|[]}>
    SuccessBooking(data:IRequiredDataDForBooking,payment_intentId:string):Promise<{success?:boolean}>
    

}



export default isUserRepository