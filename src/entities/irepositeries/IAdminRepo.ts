import { IdatasOfGeneralService, userdata, } from "../../entities/rules/admin";
import { Iproviders } from "../../entities/rules/admin";



interface IAdminRepo {
  adminSignIn(
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string,admin?:{id:string,email:string} }>;
  adminGetUserData(): Promise<{
    success: boolean;
    users?: userdata[] | [];
    active?: number;
    blocked?: number;
  }>;
  adminBlockUnBlockUser(
    id: string,
    state: boolean
  ): Promise<{ success: boolean; message?: string }>;
  getPendingProviders(): Promise<{
    success: boolean;
    message?: string;
    providers?: Iproviders[];
  }>;
  getProviders(): Promise<{
    success: boolean;
    message?: string;
    providers?: Iproviders[];
  }>;
  adminRequestAcceptAndReject(
    id: string,
    state: boolean
  ): Promise<{ success: boolean; message?: string }>;
  providerBlockOrUnblock(
    id: string,
    state: boolean
  ): Promise<{ success: boolean; message?: string }>;
  vechileTypealreadyExistOrNot(
    type: number
  ): Promise<{ success: boolean; message?: string }>;
  adminSettingsAddVechileType(
    type: number
  ): Promise<{ success: boolean; message?: string }>;
  brandExistOrNot(brand: string): Promise<{ success: boolean, message?: string }>
  adminSettingAddBrand(brand: string): Promise<{ success: boolean, message?: string }>
  settingsDatas():Promise<{success:boolean,brands?:string[],generalServices?:any[],roadAssistance?:any[]}>
  checkserviceAllreadyExistOrNot(serviceName:string):Promise<{success:boolean,message?:string}>
  addGeneralserviceOrRoadAssistance(data:IdatasOfGeneralService):Promise<{success:boolean,message?:string,created?:Object}>
  addOrUpdateSubType(data: { id: string; type: string; }): Promise<{ success: boolean; message?: string; updatedData?: any }>
  deleteSubType(data:{id:string,type:string}):Promise<{success:boolean,message?:string}>


}

export default IAdminRepo;
