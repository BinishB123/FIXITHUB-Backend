interface workshopDetails {
    address: string,
    coordinates: {
        lat: number,
        long: number
    }
}


export interface ProviderModel {
    workshopName: string,
    ownerName: string,
    email: string,
    mobile: string,
    password:string
    workshopDetails: workshopDetails,
    blocked:boolean,
    requestAccept:boolean
}