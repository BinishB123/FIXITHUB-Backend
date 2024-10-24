import { IproviderReponseData } from "entities/rules/provider";
import IProviderRepository from "../../entities/irepositeries/iProviderRepo";
import IProfileInteractor from "../../entities/provider/IprofileInteractor";


class ProviderProfileInteractor implements IProfileInteractor{
    constructor(private readonly providerRepo: IProviderRepository  ){}
    async getDataToProfile(id: string): Promise<{ success: boolean; message?: string; providerData?: IproviderReponseData | null; }> {
        try {
            const response = await this.providerRepo.getDataToProfile(id)
            return response
            
        } catch (error) {
            return {success:false,message:"500"}
        }
    }
   
    async editabout(data: { id: string; about: string; }): Promise<{ success: boolean; message?: string; }> {
        try {
            const response = await this.providerRepo.editabout(data)
            return response
            
        } catch (error) {
           return {success:false,message:"500"} 
        }
    }

    async addImage(data: { id: string; url: string; }): Promise<{ success: boolean; message: string; url?:string }> {
         try {
            const response = await  this.providerRepo.addImage(data)
            return response
         } catch (error) {
            return {success:false,message:"500"}
         }
    }

    async updateProfiledatas(data: { id: string; whichisTotChange: string; newOne: string; }): Promise<{ success: boolean; message?: string; }> {
        try {
            const response = await this.providerRepo.updateProfiledatas(data)
            return response
        } catch (error) {
            return {success:false,message:"500"}
        }
    }
}


export default ProviderProfileInteractor