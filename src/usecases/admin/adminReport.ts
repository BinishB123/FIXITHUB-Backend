import CustomError from "../../framework/services/errorInstance";
import IAdminRepo from "../../entities/irepositeries/IAdminRepo";
import { IAdminReportInteractor } from "../../entities/rules/IadminReport";
import { reportData } from "../../entities/user/IuserResponse";

class AdminReportInteractor implements IAdminReportInteractor {
    constructor(private readonly adminRepo: IAdminRepo) { }
    async getReport(): Promise<{ data: reportData[] | [] }> {
        try {
            const response = await this.adminRepo.getReport();
            return response;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }

    async editReport(id: string, status: string): Promise<{ success?: boolean }> {
        try {
            const response = await this.adminRepo.editReport(id, status);
            return response;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }
  
    async getReportDeatils(id: string): Promise<{ data: reportData }> {
        try {
            const response = await this.adminRepo.getReportDeatils(id);
            return response;
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode);
        }
    }
}

export default AdminReportInteractor;
