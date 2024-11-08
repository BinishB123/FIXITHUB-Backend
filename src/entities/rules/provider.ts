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
  logoUrl?:string
  mobile:number
}
