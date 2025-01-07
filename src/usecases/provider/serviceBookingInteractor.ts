import IStripe from "../../entities/services/Istripe";
import IProviderRepository from "../../entities/irepositeries/iProviderRepo";
import IproviderServiceBookingInteractor from "../../entities/provider/IproviderBooking";
import {
    ResponseAccordingToDate,
    ResponsegetBookingStillTodaysDate,
    ReviewResponse,
} from "../../entities/rules/provider";
import CustomError from "../../framework/services/errorInstance";

class ServiceBookingInteractor implements IproviderServiceBookingInteractor {
    constructor(
        private readonly providerRepo: IProviderRepository,
        private readonly stripe: IStripe
    ) { }

    async getBookingsAccordingToDates(
        id: string,
        date: Date
    ): Promise<{ success?: boolean; data?: ResponseAccordingToDate[] | [] }> {
        try {
            const response = await this.providerRepo.getBookingsAccordingToDates(
                id,
                date
            );
            return response;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getBookingStillTodaysDate(
        id: string,
        startIndex: number,
        status?: string | undefined
    ): Promise<{
        success?: boolean;
        data?: ResponsegetBookingStillTodaysDate[] | [];
        count: number;
    }> {
        try {
            const response = await this.providerRepo.getBookingStillTodaysDate(
                id,
                startIndex,
                status
            );
            return response;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async updateStatus(
        id: string,
        status: string,
        amount: number
    ): Promise<{ success?: boolean }> {
        try {
            const response = await this.providerRepo.updateStatus(id, status, amount);

            if (status === "outfordelivery" && amount < 1000 && response.paymentId) {
                const res = await this.stripe.refund(response.paymentId, amount);
                return res;
            }
            return { success: response.success };
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getBookingGreaterThanTodaysDate(
        id: string
    ): Promise<{
        success?: boolean;
        data?: ResponsegetBookingStillTodaysDate[] | [];
    }> {
        try {
            const response =
                await this.providerRepo.getBookingGreaterThanTodaysDate(id);

            return response;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async getFeedBacks(
        providerId: string
    ): Promise<{ feedBacks?: ReviewResponse[] | [] }> {
        try {
            const response = await this.providerRepo.getFeedBacks(providerId);
            return response;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async likeFeedBack(
        id: string,
        state: boolean
    ): Promise<{ success?: boolean }> {
        try {
            const response = await this.providerRepo.likeFeedBack(id, state);
            return response;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async reply(id: string, reply: string): Promise<{ success?: boolean }> {
        try {
            const response = await this.providerRepo.reply(id, reply);
            return response;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }
}

export default ServiceBookingInteractor;
