import { Iproviders } from "../../entities/rules/admin";

export interface IAdminProviderInteractor {
  getPendingProviders(): Promise<{
    providers?: Iproviders[];
    success: boolean;
    message?: string;
  }>;
  getProviders(): Promise<{
    providers?: Iproviders[];
    success: boolean;
    message?: string;
  }>;
  adminAcceptAndReject(
    id: string,
    state: boolean
  ): Promise<{ success: boolean; message?: string }>;
  providerBlockOrUnblock(
    id: string,
    state: boolean
  ): Promise<{ success: boolean; message?: string }>;
  getMonthlyRevenue(
    id: string
  ): Promise<{ data: { month: string; revenue: number }[] | [] }>;
  TopServicesBooked(
    id: string
  ): Promise<{ data: { serviceType: string; count: number }[] | [] }>;
}
