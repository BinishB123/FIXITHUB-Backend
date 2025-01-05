import {
    ResponseAccordingToDate,
    ResponsegetBookingStillTodaysDate,
    ReviewResponse,
} from "../../entities/rules/provider";

export default interface IproviderServiceBookingInteractor {
    getBookingsAccordingToDates(
        id: string,
        date: Date
    ): Promise<{ success?: boolean; data?: ResponseAccordingToDate[] | [] }>;
    getBookingStillTodaysDate(
        id: string,
        startIndex: number,
        status?: string | undefined
    ): Promise<{
        success?: boolean;
        data?: ResponsegetBookingStillTodaysDate[] | [];
        count: number;
    }>;
    getBookingGreaterThanTodaysDate(
        id: string
    ): Promise<{
        success?: boolean;
        data?: ResponsegetBookingStillTodaysDate[] | [];
    }>;
    updateStatus(
        id: string,
        status: string,
        amount: number
    ): Promise<{ success?: boolean }>;
    getFeedBacks(
        providerId: string
    ): Promise<{ feedBacks?: ReviewResponse[] | [] }>;
    likeFeedBack(id: string, state: boolean): Promise<{ success?: boolean }>;
    reply(id: string, reply: string): Promise<{ success?: boolean }>;
}
