import { ObjectId, Types } from "mongoose";

interface workshopDetails {
  address: string;
  coordinates: {
    lat: number;
    long: number;
  };
}

export interface RegisterResponse {
  id: string;
  ownername: string;
  workshopname: string;
  email: string;
  mobile: string;
  requested: boolean | null;
  blocked: boolean;
  logoUrl?: string | null;
}

interface workshopDetails {
  address: string;
  coordinates: {
    lat: number;
    long: number;
  };
}

export interface ProviderRegisterData {
  workshopName: string;
  ownerName: string;
  email: string;
  mobile: string;
  password: string;
  workshopDetails: workshopDetails;
}

export interface SigIn {
  email: string;
  password: string;
}

export interface SignResponse {
  id: string;
  ownername: string;
  workshopname: string;
  email: string;
  mobile: string;
  requested: boolean | null;
  blocked: boolean;
  logoUrl?: string | null;
}

/// provider schema start
interface subtype {
  type: string;
  startingPrice: number;
}

// Define the services interface
export interface services {
  typeId: Types.ObjectId; // Mongoose's ObjectId type
  category: "road" | "general"; // Restrict category to specific strings
  subtype: subtype[]; // Array of subtype objects
}

// Define the workshopDetails interface
interface WorkshopDetails {
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
}

// Define the ProviderModeSchema interface
export interface ProviderModeSchema {
  workshopName: string;
  ownerName: string;
  email: string;
  mobile: string;
  password: string;
  workshopDetails: WorkshopDetails;
  blocked: boolean;
  requestAccept: boolean | null;
  supportedBrands: { brand: ObjectId }[];
  logoUrl: string;
  about: string;
}

/// provider schema send

//providerServices start
interface providerServicesSubtype {
  type: string;
  isAdded: boolean;
  priceRange?: number;
}

export interface providingGeneralServiceData {
  typeid: string;
  typename: string;
  image: string;
  category: "general" | "road";
  isAdded: boolean;
  subType?: providerServicesSubtype[];
}

export interface ProvidingRoadServices {
  typeid: string;
  typename: string;
  image: string;
  category: "general" | "road";
  isAdded: boolean;
}

// Define the subtype interface
interface Subtype {
  type: string; // The type of service (e.g., oil change, tire rotation)
  startingPrice: number; // The starting price for the service
}

// Define the services interface
export interface Services {
  typeId: string; // ObjectId referencing the service type
  category: string; // Service category
  subtype: Subtype[]; // Array of subtype objects
}

//providerServices end

export interface ResponsedataOfproviderServices {
  workshopName: string;
  ownerName: string;
  email: string;
  mobile: string;
  password: string;
  workshopDetails: workshopDetails;
  blocked: boolean;
  requestAccept: boolean | null;
}

//propvidingServicesSchema
export interface propvidingServicesSchema {
  workshopId: Types.ObjectId;
  twoWheeler: services[];
  fourWheeler: services[];
}

export interface IproviderReponseData {
  _id: ObjectId;
  workshopName: string;
  ownerName: string;
  email: string;
  workshopDetails: workshopDetails;
  blocked: boolean;
  requestAccept: boolean | null;
  supportedBrands: { brand: ObjectId }[];
  about?: string;
  logoUrl?: string;
  mobile: number;
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

interface User {
  name: string;
  mobile: number;
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
  user: User;
  bookeddate: BookedDate;
  servicename: ServiceName;
}

export interface ResponsegetBookingStillTodaysDate {
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

export interface NotifyGetterResponse {
  _id: ObjectId;
  providerId: ObjectId;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  latestMessage: ObjectId;
  message: {
    _id: ObjectId;
    sender: "user";
    chatId: ObjectId;
    message: string;
    providerdelete: boolean;
    userdelete: boolean;
    seen: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface UnreadMessageCount {
  _id: ObjectId;
  count: number;
}

export interface INotifyGetterResponse {
  _id: ObjectId;
  providerId: ObjectId;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  latestMessage: ObjectId;
  count: number;
  message: {
    _id: ObjectId;
    sender: "user";
    chatId: ObjectId;
    message: string;
    providerdelete: boolean;
    userdelete: boolean;
    seen: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface IMessage {
  _id: ObjectId;
  sender: "user";
  chatId: ObjectId;
  message: string;
  providerdelete: boolean;
  userdelete: boolean;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotifyGetterResponse {
  _id: ObjectId;
  providerId: ObjectId;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  latestMessage: ObjectId;
  count: number;
  message: IMessage; // Reference the extracted type
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
  user: {
    _id: ObjectId;
    logoUrl: string;
    name: string;
  };
}


 interface sel{
  
    typeId :ObjectId | string
    serviceName:string
    price:number
    _id:ObjectId|string
 }
export interface SalesReport {
  _id: ObjectId | string,
  service: {
    serviceType: string
  }
  user: {
    name: string,
  }
  selectedDate: {
    date: Date
  }
  totalPrice:number
  selectedService: sel[]


  
}

