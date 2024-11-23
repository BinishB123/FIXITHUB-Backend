import { ObjectId } from "mongoose";

export interface user{
    name: string,
    mobile: number,
    email: string,
    password: string
    logoUrl?:string
    blocked:boolean
    
}

export interface userSignIn{
      email:string,
      password:string
}

// interface for data that going as response from repo
export interface userResponseData{
    id:string,
    name:string,
    email:string,
    mobile:string,
    logoUrl?:string
    blocked:boolean
    
}


interface WorkshopDetails {
    address: string;
    location: {
      type: string;
      coordinates: [number, number];
    };
  }
  
  interface SupportedBrand {
    brand: ObjectId;
    _id: ObjectId;
  }
  
  interface Subtype {
    type: ObjectId;
    startingPrice: number;
    _id: ObjectId;
  }
  
  interface TwoWheeler {
    typeId: ObjectId;
    category: string;
    subTypes: Subtype;
    _id: ObjectId;
  }
  
  interface FourWheeler {}
  
  interface ITwoWheeler {
    typeId: ObjectId;
    category: string;
    subtype: {
      type:ObjectId,
      startingPrice:number,
      _id:ObjectId
    }; 
    _id: ObjectId;
  }
  
  
  interface IProvider {
    workshopName: string;
    ownerName: string;
    email: string;
    mobile: string;
    workshopDetails: any[]; 
    logoUrl: string;
    about:string
  }
  

  export interface Provider {
   
    _id: ObjectId;
  workshopId: ObjectId;
  twoWheeler?: ITwoWheeler;
  fourWheeler?:ITwoWheeler
  provider: IProvider;
  }





export interface  IRequiredDataDForBooking {
  providerId:string ,
  userId:string,
  date:string ,
  vehicleType:string,
  serviceType:string ,
  selectedService:{typeId:string,serviceName:string,price:number}[] ,
  suggestions?:string,
  vehicleDetails: {
      vehicleId:string ,
      brand:string ,
      model:string,
      fueltype:string, 
      kilometer:string
  },
}



export default user