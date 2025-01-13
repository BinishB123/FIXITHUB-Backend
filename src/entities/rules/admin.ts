import { ObjectId } from "mongoose"

export interface userdata {
    id: string,
    name: string,
    blocked: boolean,
    email: string,
    mobile: number
}

export interface Iproviders {
    _id: string,
    workshopName: string,
    ownerName: string,
    mobile: string,
    workshopDetails: string,
    blocked: boolean,
    requestAccept: boolean | null

}
export interface vehicleType {
    vehicleType: number
}


export interface IdatasOfGeneralService {
    category: "general" | "road",
    servicetype: string,
    imageUrl: string
}

export interface servicetypeSchemaModel {
    category: "general" | "road",
    serviceType: string
    imageUrl:string
    subTypes: {_id:string,type:string}[]


}
export interface servicetype {
    _id:string
    category:  "general" | "road",
    serviceType: string
    imageUrl:string
    subTypes?: {_id:string,type:string}[]


}

export interface subtypeSchemaModel{
    _id: string;
     type:string
}






  interface SelectedService {
    typeId: ObjectId;
    serviceName: string;
    price: number;
    _id: ObjectId;
  }
  
  interface VehicleDetails {
    brand: ObjectId;
    model: string;
    fueltype: string;
    kilometer: number;
  }
  

  
  interface BookedDate {
    date: Date;
  }
  
  interface ServiceName {
    serviceType: string;
  }
  
  
  interface SelectedService {
    typeId: ObjectId;
    serviceName: string;
    price: number;
    _id: ObjectId;
  }
  
  export interface ResponseAccordingToDate {
    _id: ObjectId;
    selectedService: SelectedService[];
    vechileDetails: VehicleDetails;
    advanceAmount: number;
    advance: boolean;
    status: string;
    amountpaid: number;
    paymentStatus: string;
    bookeddate: BookedDate;
    servicename: ServiceName;
  }
  
  export interface Booking {
    _id: ObjectId;
    selectedService: SelectedService[];
    vechileDetails: VehicleDetails;
    advanceAmount: number;
    advance: boolean;
    status: string;
    amountpaid: number;
    paymentStatus: string;
    user: {
      _id: ObjectId;
      name: string;
      mobile: number;
      logoUrl: string;
    };
    bookeddate: BookedDate;
    servicename: ServiceName;
    brand: {
      brand: string;
    };
    suggestions: string;
  }
  

  export interface reportData {
    _id?: ObjectId | string;
    userId: string | ObjectId;
    providerId: string | ObjectId;
    BookingId: string | ObjectId;
    report: string;
    provider?: {
      workshopName: string;
      logoUrl: string;
    };
    user?: {
      name: string;
      logoUrl: string;
    };
    status?: "Pending" | "In Progress" | "Approved" | "Rejected" | "Completed";
    booking?:ResponseAccordingToDate
  }



  interface sel{
  
    typeId :ObjectId | string
    serviceName:string
    price:number
    _id:ObjectId|string
 }
export interface IASalesReport {
  _id: ObjectId | string,
  service: {
    serviceType: string
  }
  user: {
    name: string,
  },
  provider:{
    workshopName: string;
  }
  selectedDate: {
    date: Date
  }
  selectedService: sel[]


  
}