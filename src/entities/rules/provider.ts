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
    password: string
    workshopDetails: workshopDetails,
    blocked: boolean,
    requestAccept: boolean
}

export interface RegisterResponse {
    id: string,
    ownername: string
    workshopname: string,
    email: string,
    mobile: string,
    requested: boolean,
    blocked: boolean
}

interface workshopDetails {
    address: string,
    coordinates: {
        lat: number,
        long: number
    }
}

export interface ProviderRegisterData {
    workshopName: string,
    ownerName: string,
    email: string,
    mobile: string,
    password: string
    workshopDetails: workshopDetails,
}