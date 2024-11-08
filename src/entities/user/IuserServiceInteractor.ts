import { IgetservicesResponse, IRequirementToFetchShops, ProviderShopSelectedServiceFinalData } from "./IuserResponse";


interface IuserServiceInteractor{
    getServices(category:string):Promise<{success:boolean,message:string,services?:IgetservicesResponse[]}>
    getAllBrand():Promise<{success:boolean,message?:string,brandData?:{_id:string,brand:string}[]|null}>
    getAllShops(data:IRequirementToFetchShops):Promise<{success:boolean,message?:string,shops?:any[]}>  
    getshopProfileWithSelectedServices(data:{serviceId:string,vehicleType:string,providerId:string}):Promise<{success:boolean,message?:string,shopDetail?:ProviderShopSelectedServiceFinalData}>  
  



}

export default IuserServiceInteractor