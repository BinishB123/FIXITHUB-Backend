import { ObjectId } from "mongodb";

export enum BookingStatus {
    Pending = "pending",
    Confirmed = "confirmed",
    InProgress = "inprogress",
    OutForDelivery = "outfordelivery",
    Completed = "completed",
    Cancelled = "cancelled",
    OnHold = "onhold",
    Failed = "failed"
}

export enum PaymentStatus {
    Pending = "pending",
    Paid = "paid"
}

export default interface BookingSchema {
    providerId: ObjectId;
    userId: ObjectId;
    date: ObjectId;
    amountPaid: number;
    vechileType:string,
    additionalCharge: number;
    serviceType: ObjectId;
    selectedService: SelectedService[];
    suggestions: string;
    status: "pending" | "confirmed" | "inprogress" | "outfordelivery" | "completed" | "cancelled" | "onhold" | "failed";
    paymentStatus: "pending"| "paid";
    vechileDetails:{
        vechileId:string,
        brand:ObjectId,
        model:string
        fueltype:string
    }
    bookingfee:number,
    bookingfeeStatus:boolean
    paymentIntentId:string
}

interface SelectedService {
    typeId: ObjectId;
    serviceName: string;
    price: number;
}
