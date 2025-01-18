import user, {
    IRequiredDataDForBooking,
    Provider,
    userResponseData,
    userSignIn,
} from "entities/rules/user";
import {
    IgetservicesResponse,
    IRequirementToFetchShops,
    NotifyGetterResponse,
    reportData,
    ResponsegetBookingGreaterThanTodaysDate,
    responseGetReviewDetails,
    reviewAddedResponse,
    ReviewResponse,
    UnreadMessageCount,
} from "entities/user/IuserResponse";
import { ObjectId } from "mongoose";

interface isUserRepository {
    tempOTp(otp: string, email: string): Promise<{ created: boolean }>;
    userexist(email: string): Promise<boolean>;
    otpverification(email: string, otp: string): Promise<boolean>;
    signup(userData: user): Promise<{ user: userResponseData; created: boolean }>;
    signin(
        userData: userSignIn
    ): Promise<{ user?: userResponseData; success: boolean; message?: string }>;
    checker(id: string): Promise<{ success?: boolean; message?: string }>;
    getServices(category: string): Promise<{
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
        shopDetail?: Provider[] | [];
        service?:
        | {
            _id: ObjectId;
            category: string;
            serviceType: string;
            imageUrl: string;
            subTypes: { type: string; _id: ObjectId }[];
        }
        | any;
    }>;
    userUpdateData(data: {
        id: string;
        newData: string;
        whichToChange: string;
    }): Promise<{ success?: boolean; message?: string; newData?: string }>;
    addOrChangePhoto(data: {
        id: string;
        url?: string;
    }): Promise<{ success?: boolean; message?: string; url?: string }>;
    getBookingDates(id: string): Promise<{
        success?: boolean;
        data?: { _id: ObjectId; date: Date; count: number }[] | [];
    }>;
    SuccessBooking(
        data: IRequiredDataDForBooking,
        payment_intentId: string
    ): Promise<{ success?: boolean }>;
    getLatestBooking(userId: string): Promise<{
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
        date: string
    ): Promise<{ success?: boolean; payemntid?: string }>;
    notificationCountUpdater(id: string): Promise<{ count: number }>;
    notificationsGetter(id: string): Promise<{
        notfiyData: NotifyGetterResponse[] | [];
        countOfUnreadMessages: UnreadMessageCount[] | [];
    }>;
    addReview(
        data: {
            review: string;
            userId: string;
            providerId: string;
            serviceId: string;
            bookingId: string;
        },
        result: { url?: string }[]
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
    getFeedBacks(
        Id: string,
        limit: number
    ): Promise<{ feedBacks?: ReviewResponse[] | [] }>;
    createReport(data: reportData): Promise<{ success?: boolean }>;
    getReport(id:string): Promise<{data:reportData[]|[]}>
    getBrands():Promise<{brands:string[]}>
    getShops():Promise<{shops:any[]}>
}

export default isUserRepository;
