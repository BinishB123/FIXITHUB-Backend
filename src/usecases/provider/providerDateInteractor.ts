import CustomError from "../../framework/services/errorInstance";
import IProviderRepository from "../../entities/irepositeries/iProviderRepo";
import IProviderDateInteractor from "../../entities/provider/IproviderDatesInteractor";
import { ObjectId } from "mongoose";

class ProviderBookingDateInteractor implements IProviderDateInteractor{
    constructor(private readonly providerRepo :IProviderRepository){}
    async addDate(date: Date, id: string): Promise<{ success?: boolean; id: string; }> {
        try {
            const response = await this.providerRepo.addDate(date,id)
            return response
            
        } catch (error:any) {
            throw new CustomError(error.message,error.statusCode)
        }
    }

    async providerAddedDates(id: string): Promise<{ success?: boolean; data: { _id: ObjectId; date: Date; }[] | []; }> {
        try {
            const response = this.providerRepo.providerAddedDates(id)
            return response
        } catch (error:any) {
            throw new CustomError(error.message,error.statusCode)
        }
    }

    async updateCount(id: string,toDo:string): Promise<{ success?: boolean; }> {
        try {
            const response = await this.providerRepo.updateCount(id,toDo)
            return response
            
        } catch (error:any) {
            throw new CustomError(error.message,error.statusCode)
        }
    }
}


export default ProviderBookingDateInteractor