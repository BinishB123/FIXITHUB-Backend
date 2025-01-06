import { Iproviders } from "../../entities/rules/admin";
import { IAdminProviderInteractor } from "../../entities/admin/IadminProvider";
import IAdminRepo from "../../entities/irepositeries/IAdminRepo";
import CustomError from "../../framework/services/errorInstance";

class AdminProviderInteractor implements IAdminProviderInteractor {
    constructor(private readonly adminrepo: IAdminRepo) { }
    async getPendingProviders(): Promise<{ providers?: Iproviders[]; success: boolean; message?: string; }> {
        try {
            const response = await this.adminrepo.getPendingProviders()
            if (!response.success) {
                return { success: false, message: response.message }
            }
            return {success:true,providers:response.providers}

        } catch (error) {
            return { success: false }
        }
    }
   async getProviders(): Promise<{ providers?: Iproviders[]; success: boolean; message?: string; }> {
    try {
        const response = await this.adminrepo.getProviders()
        if (!response.success) {
            return { success: false, message: response.message }
        }
        return {success:true,providers:response.providers}

    } catch (error) {
        return { success: false }
    }
   }
    
   async adminAcceptAndReject(id: string, state: boolean): Promise<{ success: boolean; message?: string; }> {
    try {
        const response = await this.adminrepo.adminRequestAcceptAndReject(id,state)
        if (response.success) {
            return {success:true,message:""}
        }
       return{success:false}
    } catch (error) {
        return {success:true}
    }
   }
   async providerBlockOrUnblock(id: string, state: boolean): Promise<{ success: boolean; message?: string; }> {
    try {
        const response = await this.adminrepo.providerBlockOrUnblock(id,state)
        if (response.success) {
            return {success:true,message:""}
        }
       return{success:false}
    } catch (error) {
        return {success:true}
    }
       
   }
   
   async getMonthlyRevenue(id: string): Promise<{ data: { month: string; revenue: number; }[] | []; }> {
    try {
        const response = await this.adminrepo.getMonthlyRevenue(id)
        return response
        
    } catch (error: any) {
        throw new CustomError(error.message, error.statusCode)
    }
}

async TopServicesBooked(id: string): Promise<{ data: { serviceType: string; count: number; }[] | []; }> {
    try {
        const response = await this.adminrepo.TopServicesBooked(id)
        return response
    } catch (error: any) {
        throw new CustomError(error.message, error.statusCode)
    }
}

  


}
export default AdminProviderInteractor 