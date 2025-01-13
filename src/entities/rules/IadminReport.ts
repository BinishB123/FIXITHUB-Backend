import { IASalesReport, reportData } from "./admin";

export interface IAdminReportInteractor {
    getReport(): Promise<{ data: reportData[] | [] }>;
    editReport(id: string, status: string): Promise<{ success?: boolean }>;
    getReportDeatils(id: string): Promise<{ data: reportData }>;
     getSalesReport(year:number,month:number):Promise<{report:IASalesReport[]|[]}>
    
}
