import { INotifyGetterResponse, IproviderReponseData } from "../../entities/rules/provider";
import IProviderRepository from "../../entities/irepositeries/iProviderRepo";
import IProfileInteractor from "../../entities/provider/IprofileInteractor";
import CustomError from "../../framework/services/errorInstance";


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

     async getAllBrand(id: string): Promise<{ success: boolean; message?: string; brandData?: { _id: string; brand: string; }[] | null; }> {
             try {
                const response = await this.providerRepo.getAllBrand(id)
                return response
             } catch (error) {
                return {success:false,message:"500"}
             }
    }

    async changepassword(data: { id: string; currentpassowrd: string; newpassowrd: string; }): Promise<{ success?: boolean; message?: string; }> {
        try {
            const response = await this.providerRepo.changepassword(data)
            return response
        } catch (error:any) {
           throw new CustomError(error.message,error.statusCode)
        }
    }

    async updateLogo(url: string, id: string): Promise<{ success?: boolean; message?: string; url?:string }> {
        try {
           const  response = await this.providerRepo.updateLogo(url,id)
           return response
        } catch (error:any) {
            throw new CustomError(error.message,error.statusCode)
        }
    }

    async notificationCountUpdater(id: string): Promise<{ count: number; }> {
        try {
            const response = await this.providerRepo.notificationCountUpdater(id)
            return response

        } catch (error: any) {

            throw new CustomError(error.message, error.statusCode)
        }
    }

    async notificationsGetter(id: string): Promise<{ notfiyData: INotifyGetterResponse[] | []; }> {
        try {
            const response = await this.providerRepo.notificationsGetter(id)
            console.log("his.providerRepo.notificationsGetter(id)",response);
            
          
            if (response.countOfUnreadMessages.length > 0 && response.notfiyData.length > 0) {

                const data: INotifyGetterResponse[] = response.notfiyData.map((data) => {
                    const matchedItem = response.countOfUnreadMessages.find((item) => item._id+"" === data._id+"");
                    return { ...data, count: matchedItem ? matchedItem.count : 1 };
                });
               
                return { notfiyData: data }

            }
            return { notfiyData: [] }
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

}


export default ProviderProfileInteractor