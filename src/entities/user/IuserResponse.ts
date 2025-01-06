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
 



export interface SelectedService {
  typeId?: ObjectId|string;
  serviceName: string;
  price: number;
  _id?: ObjectId|string;
}

interface VehicleDetails {
  brand: ObjectId;
  model: string;
  fueltype: string;
  kilometer: number;
}

interface User {
  name: string;
  mobile: number;
  
}

interface BookedDate {
  date: Date;
}

interface ServiceName {
  serviceType: string;
  _id:ObjectId
}

export interface ResponseAccordingToDate {
  _id: ObjectId;
  selectedService: SelectedService[];
  vechileDetails: VehicleDetails;
  advanceAmount: number;
  advance: boolean,
  status:string,
  amountpaid: number,
  paymentStatus:string,
  user: User;
  bookeddate: BookedDate;
  servicename: ServiceName;
}

export interface ResponsegetBookingGreaterThanTodaysDate{
  _id: ObjectId;
  selectedService: SelectedService[];
  vechileDetails: VehicleDetails;
  date:ObjectId,
  advanceAmount: number;
  advance: boolean,
  status:string,
  amountpaid: number,
  vechileType:string,
  paymentStatus:string,
  provider: {
  _id:ObjectId
   workshopName: string;
   mobile: number;
   logoUrl:string
  };
  bookeddate: BookedDate;
  servicename: ServiceName;

  brand:{
    brand:string
  }
  suggestions:string
  review?:ObjectId|null
}



export interface NotifyGetterResponse{
  
    _id: ObjectId,
    providerId: ObjectId,
    userId: ObjectId,
    createdAt:Date,
    updatedAt:Date,
    latestMessage: ObjectId,
    message: {
      _id: ObjectId,
      sender: 'provider',
      chatId: ObjectId,
      message: string,
      providerdelete: boolean,
      userdelete: boolean,
      seen: boolean,
      createdAt: Date,
      updatedAt: Date,
      
    }
  
}

export interface UnreadMessageCount {
  _id:ObjectId
  count:number
}


export interface INotifyGetterResponse{
  
  _id: ObjectId,
  providerId: ObjectId,
  userId: ObjectId,
  createdAt:Date,
  updatedAt:Date,
  latestMessage: ObjectId,
  count:number,
  message: {
    _id: ObjectId,
    sender: 'provider',
    chatId: ObjectId,
    message: string,
    providerdelete: boolean,
    userdelete: boolean,
    seen: boolean,
    createdAt: Date,
    updatedAt: Date,
    
  }

}


export interface reviewAddedResponse {
  _id: string;  
  userId: ObjectId;
  ProviderId: ObjectId;
  ServiceId: ObjectId;
  bookingId: ObjectId;
  opinion: string;
  reply: string | null;
  like: boolean;
  images: { url: string }[];
}

export interface responseGetReviewDetails{
  _id: string;  
  userId: ObjectId;
  ServiceId: ObjectId;
  bookingId: ObjectId;
  opinion: string;
  reply: string | null;
  like: boolean;
  images: { url: string }[];
  provider:{
    _id:ObjectId
    logoUrl:string
    workshopName:string
  }
  


}


export interface ReviewResponse {
  _id: ObjectId;  
  userId: ObjectId;
  ServiceId: ObjectId;
  bookingId: ObjectId;
  opinion: string;
  reply: string | null;
  like: boolean;
  images: { url: string }[];
   user:{
    _id:ObjectId
    logoUrl:string
    name:string
  }
}