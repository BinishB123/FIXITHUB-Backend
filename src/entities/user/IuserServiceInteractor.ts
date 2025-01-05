import { ObjectId } from "mongoose";
import {
    IgetservicesResponse,
    IRequirementToFetchShops,
    ProviderShopSelectedServiceFinalData,
    ResponsegetBookingGreaterThanTodaysDate,
    responseGetReviewDetails,
    reviewAddedResponse,
} from "./IuserResponse";
import { IRequiredDataDForBooking } from "../../entities/rules/user";
import { ReviewResponse } from "entities/rules/provider";

interface IuserServiceInteractor {
    getServices(
        category: string
    ): Promise<{
        success: boolean;
        message: string;
        services?: IgetservicesResponse[];
    }>;
    getAllBrand(): Promise<{
        success: boolean;
        message?: string;
        brandData?: { _id: string; brand: string }[] | null;
    }>;
    getAllShops(
        data: IRequirementToFetchShops
    ): Promise<{ success: boolean; message?: string; shops?: any[] }>;
    getshopProfileWithSelectedServices(data: {
        serviceId: string;
        vehicleType: string;
        providerId: string;
    }): Promise<{
        success: boolean;
        message?: string;
        shopDetail?: ProviderShopSelectedServiceFinalData;
    }>;
    getBookingDates(
        id: string
    ): Promise<{
        success?: boolean;
        data?: { _id: ObjectId; date: Date; count: number }[] | [];
    }>;
    SuccessBooking(
        data: IRequiredDataDForBooking,
        sessionId: string
    ): Promise<{ success?: boolean }>;
    getLatestBooking(
        userId: string
    ): Promise<{
        success?: boolean;
        data?: ResponsegetBookingGreaterThanTodaysDate[] | [];
    }>;
    getServiceHistory(
        userID: string,
        startindex: number,
        endindex: number
    ): Promise<{
        success?: boolean;
        data?: ResponsegetBookingGreaterThanTodaysDate[] | [];
        count: number;
    }>;
    afterFullpaymentDone(docId: string): Promise<{ success?: boolean }>;
    cancelBooking(
        id: string,
        amount: number,
        date: string
    ): Promise<{ success?: boolean }>;
    addReview(
        data: {
            review: string;
            userId: string;
            providerId: string;
            serviceId: string;
            bookingId: string;
        },
        result: { url?: string; message?: string }[]
    ): Promise<{ success?: boolean; review?: reviewAddedResponse }>;
    getReviewDetails(
        id: string
    ): Promise<{ ReviewData?: responseGetReviewDetails }>;
    deleteOneImage(id: string, url: string): Promise<{ success?: boolean }>;
    editReview(id: string, newReview: string): Promise<{ success?: boolean }>;
    addOneImage(
        id: string,
        newImageUrl: string
    ): Promise<{ success: boolean; url: string }>;
    
}

export default IuserServiceInteractor;
