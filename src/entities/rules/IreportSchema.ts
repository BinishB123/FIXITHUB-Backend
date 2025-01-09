import { ObjectId } from "mongoose";

export interface IReportSchema{
    userId:ObjectId,
    providerId:ObjectId,
    BookingId:ObjectId,
    report:string,
    status: "Pending"|"In Progress"|"Approved"|"Rejected"|"Completed"
}