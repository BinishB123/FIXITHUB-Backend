import { ObjectId } from "mongoose";

export interface IgetservicesResponse{
     _id:ObjectId
     category: string,
     serviceType: string,
     imageUrl:string
}