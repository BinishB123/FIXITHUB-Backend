import { ObjectId } from "mongoose";

export interface IgetservicesResponse{
     _id:ObjectId
     category: string,
     serviceType: string,
     imageUrl:string
}

export interface IRequirementToFetchShops{
     vehicleType:string,
     serviceId:string,
     coordinates:[number,number],
     category:string  
     brand:string,   
}


interface WorkshopDetails {
     address: string;
     location: {
       type: string;
       coordinates: [number, number];
     };
   }
   
  
  export interface Service {
      typeid:string,
      typename:string,
      startingprice:number|undefined,
      isAdded :boolean
   }
   
   export interface ProviderShopSelectedServiceFinalData {
     workshopName: string;
     ownerName: string;
     email: string;
     mobile: string;
     workshopDetails: WorkshopDetails|any;
     logoUrl: string;
     about:string;
     selectedService:{_id:string,type:string}
     services: Service[];
   }
 
 
 




  ////get shop profile selected service start 
  interface ITwoWheeler {
    typeId: ObjectId;
    category: string;
    subtype: {_id:ObjectId,type:ObjectId,startingPrice:number}[]; 
    _id: ObjectId;
  }
  
  interface IProvider {
    workshopName: string;
    ownerName: string;
    email: string;
    mobile: string;
    workshopDetails: any[]; 
    logoUrl: string;
  }
  
  interface IShopDetail {
    _id: ObjectId;
    workshopId: ObjectId;
    twoWheeler?: ITwoWheeler[];
    fourWheeler?:ITwoWheeler[]
    provider: IProvider[];
  }
  
interface IService {
    _id: ObjectId;
    category: string;
    serviceType: string;
    imageUrl: string;
    subTypes: {type:string,_id:ObjectId}[]; 
    __v: number;
  }

  // Main response interface
export interface IGetShopProfileWithSelectedServicesResponse {
  success: boolean;
  shopDetail?: IShopDetail[];
  service: IService;
}
 