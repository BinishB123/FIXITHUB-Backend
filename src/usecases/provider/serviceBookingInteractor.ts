import IProviderRepository from "../../entities/irepositeries/iProviderRepo";
import IproviderServiceBookingInteractor from "../../entities/provider/IproviderBooking";
import { ResponseAccordingToDate, ResponsegetBookingStillTodaysDate } from "../../entities/rules/provider";
import CustomError from "../../framework/services/errorInstance";


class ServiceBookingInteractor implements IproviderServiceBookingInteractor {

    constructor(private readonly providerRepo:IProviderRepository){}

    async getBookingsAccordingToDates(id: string, date: Date): Promise<{ success?: boolean; data?: ResponseAccordingToDate[]|[]; }> {
        try {
            const response = await this.providerRepo.getBookingsAccordingToDates(id,date)
            return response
        } catch (error:any) {
            throw new CustomError(error.message,error.statusCode)
        }
    }

     async getBookingStillTodaysDate(id: string, status?: string|undefined): Promise<{ success?: boolean; data?: ResponsegetBookingStillTodaysDate[] | []; }> {
        try {
            
            
            const response = await this.providerRepo.getBookingStillTodaysDate(id,status)
            return response
            
        } catch (error:any) {
            throw new CustomError(error.message,error.statusCode)
        }
     }

     async updateStatus(id: string, status: string): Promise<{ success?: boolean; }> {
         try {
            const response = await this.providerRepo.updateStatus(id,status)
            return response
            
         } catch (error:any) {
            throw new CustomError(error.message,error.statusCode)
         }
     }

}

export default ServiceBookingInteractor