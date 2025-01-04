import { ObjectId } from "mongoose";



export interface ReviewSchema{
    bookingId:ObjectId,
    userId:ObjectId,
    ProviderId:ObjectId,
    ServiceId:ObjectId,
    opinion:string,
    reply:string | null
    like:boolean,
    images:{url:string}[]
}