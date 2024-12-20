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
