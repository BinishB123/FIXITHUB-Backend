import { ObjectId } from "mongoose";
import { IgetservicesResponse, IRequirementToFetchShops, ProviderShopSelectedServiceFinalData, ResponsegetBookingGreaterThanTodaysDate } from "./IuserResponse";
import { IRequiredDataDForBooking } from "../../entities/rules/user";


interface IuserServiceInteractor{
    getServices(category:string):Promise<{success:boolean,message:string,services?:IgetservicesResponse[]}>
    getAllBrand():Promise<{success:boolean,message?:string,brandData?:{_id:string,brand:string}[]|null}>
    getAllShops(data:IRequirementToFetchShops):Promise<{success:boolean,message?:string,shops?:any[]}>  
    getshopProfileWithSelectedServices(data:{serviceId:string,vehicleType:string,providerId:string}):Promise<{success:boolean,message?:string,shopDetail?:ProviderShopSelectedServiceFinalData}>
    getBookingDates(id:string):Promise<{success?:boolean,data?:{_id:ObjectId, date:Date,count:number}[]|[]}>
    SuccessBooking(data:IRequiredDataDForBooking,sessionId:string):Promise<{success?:boolean}>
    getLatestBooking(userId:string):Promise<{success?:boolean,data?:ResponsegetBookingGreaterThanTodaysDate[]|[]}>
    getServiceHistory(userID:string):Promise<{success?:boolean,data?:ResponsegetBookingGreaterThanTodaysDate[]|[]   }>
    afterFullpaymentDone(docId:string):Promise<{success?:boolean}>
    cancelBooking(id:string,amount:number,date:string):Promise<{success?:boolean}>



  
  



}

export default IuserServiceInteractor