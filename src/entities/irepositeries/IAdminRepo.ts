import { userdata } from "../../entities/rules/admin";
import { Iproviders } from "../../entities/rules/admin";

interface IAdminRepo {
    adminSignIn(email: string, password: string): Promise<{ success: boolean, message?: string }>;
    adminGetUserData(): Promise<{ success: boolean, users?: userdata[] | [], active?: number, blocked?: number }>
    adminBlockUnBlockUser(id: string, state:boolean): Promise<{ success: boolean, message?: string }>
    getPendingProviders():Promise<{success:boolean, message?:string,providers?:Iproviders[]}>
    getProviders():Promise<{success:boolean, message?:string,providers?:Iproviders[]}>
    adminRequestAcceptAndReject(id: string, state: boolean): Promise<{ success: boolean; message?: string; }> 
    providerBlockOrUnblock(id: string, state: boolean): Promise<{ success: boolean; message?: string; }> 
}

export default IAdminRepo