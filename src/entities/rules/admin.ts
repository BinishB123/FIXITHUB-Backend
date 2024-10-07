export interface userdata {
    id:string,
    name:string,
    blocked:boolean,
    email:string,
    mobile:number
}

export interface Iproviders{
    _id:string,
    workshopName:string,
    ownerName:string,
    mobile:string,
    workshopDetails:string,
    blocked:boolean,
    requestAccept:boolean | null
    
}
