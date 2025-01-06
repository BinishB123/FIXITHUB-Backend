import { IdatasOfGeneralService, userdata } from "../../entities/rules/admin";
import { Iproviders } from "../../entities/rules/admin";

interface IAdminRepo {
  adminSignIn(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message?: string;
    admin?: { id: string; email: string };
  }>;
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
  vehicleTypealreadyExistOrNot(
    type: number
  ): Promise<{ success: boolean; message?: string }>;
  adminSettingsAddvehicleType(
    type: number
  ): Promise<{ success: boolean; message?: string }>;
  brandExistOrNot(
    brand: string
  ): Promise<{ success: boolean; message?: string }>;
  adminSettingAddBrand(
    brand: string
  ): Promise<{ success: boolean; message?: string }>;
  settingsDatas(): Promise<{
    success: boolean;
    brands?: string[];
    generalServices?: any[];
    roadAssistance?: any[];
  }>;
  checkserviceAllreadyExistOrNot(
    serviceName: string
  ): Promise<{ success: boolean; message?: string }>;
  addGeneralserviceOrRoadAssistance(
    data: IdatasOfGeneralService
  ): Promise<{ success: boolean; message?: string; created?: Object }>;
  addOrUpdateSubType(data: {
    id: string;
    type: string;
  }): Promise<{ success: boolean; message?: string; updatedData?: any }>;
  deleteSubType(data: {
    id: string;
    type: string;
  }): Promise<{ success: boolean; message?: string }>;
  editServiceName(data: {
    id: string;
    newName: string;
  }): Promise<{ success: boolean }>;
  getMonthlyRevenue(
    id: string
  ): Promise<{ data: { month: string; revenue: number }[] | [] }>;
  TopServicesBooked(
    id: string
  ): Promise<{ data: { serviceType: string; count: number }[] | [] }>;
}

export default IAdminRepo;
