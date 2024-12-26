import HttpStatus from "../../../entities/rules/statusCode";
import IproviderServiceBookingInteractor from "../../../entities/provider/IproviderBooking";
import { NextFunction, Request, Response } from "express";


class ProviderServiceBookingController {
    constructor(private readonly serviceBookingInteractor:IproviderServiceBookingInteractor){}

    async getProviderDataAccordingToDate(req:Request,res:Response,next:NextFunction){
        try {
            const {id,date} = req.params
            console.log("id",id,date);
            
            const response = await  this.serviceBookingInteractor.getBookingsAccordingToDates(id,new Date(date))
            return res.status(HttpStatus.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    async getBookingStillTodaysDate(req:Request,res:Response,next:NextFunction){
        try {
            const {id,startIndex} = req.params
            let { status } = req.query;
            status = typeof status === 'string' ? status : undefined;
            const response = await this.serviceBookingInteractor.getBookingStillTodaysDate(id,parseInt(startIndex),status);
            return res.status(HttpStatus.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    async updateStatus(req:Request,res:Response,next:NextFunction){
        try {
            const {id,status,amount} = req.params
            if (!id||!status||!amount) {
                return res.status(HttpStatus.FORBIDDEN).json({message:"Something went Wrong"})
            }
            const response = await this.serviceBookingInteractor.updateStatus(id,status,parseInt(amount))
            return res.status(HttpStatus.OK).json(response)
            
        } catch (error) {
           next(error)
        }
    }

    async getBookingGreaterThanTodaysDate(req:Request,res:Response,next:NextFunction){
        try {
            const {userid} = req.params
            const response = await this.serviceBookingInteractor.getBookingGreaterThanTodaysDate(userid)
            return res.status(HttpStatus.OK).json(response)
        } catch (error) {
            next(error)
        }
    }
}

export default ProviderServiceBookingController