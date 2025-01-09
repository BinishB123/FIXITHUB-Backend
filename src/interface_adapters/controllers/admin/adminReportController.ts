import { NextFunction, Request, Response } from "express";
import { IAdminReportInteractor } from "../../../entities/rules/IadminReport";
import HttpStatus from "../../../entities/rules/statusCode";


class AdminReportController {
    constructor(private readonly reportInteractor:IAdminReportInteractor){}
    async getReport(req:Request,res:Response,next:NextFunction){
        try {
            const response = await this.reportInteractor.getReport()
            return res.status(HttpStatus.OK).json(response)
            
        } catch (error) {
            next(error)
        }
    }

    async editReport(req:Request,res:Response,next:NextFunction){
        try {
            const {id,status} = req.params
            const response = await this.reportInteractor.editReport(id,status)
            return res.status(HttpStatus.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    async getReportDeatils(req:Request,res:Response,next:NextFunction){
        try {
            const {id} = req.params
            const response = await this.reportInteractor.getReportDeatils(id)
            return res.status(HttpStatus.OK).json(response)
        } catch (error) {
            next(error)
        }
    }
}

export default AdminReportController