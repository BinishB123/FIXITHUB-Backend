import { NextFunction, Request, Response } from "express";
import IProviderDateInteractor from "../../../entities/provider/IproviderDatesInteractor";
import HttpStatus from "../../../entities/rules/statusCode";

class ProviderDateController {
    constructor(private readonly providerDateInteractor:IProviderDateInteractor){}

    async addDate(req:Request,res:Response,next:NextFunction){
        try {
             const {date,id} = req.body 
             const response = await this.providerDateInteractor.addDate(date,id)
              return res.status(HttpStatus.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    async addedDates(req:Request,res:Response,next:NextFunction){
        try {
            const {id} = req.params
            const response = await this.providerDateInteractor.providerAddedDates(id)
            return res.status(HttpStatus.OK).json(response)
        } catch (error) {
            next(error)
        }
    }

    async updateCount(req:Request,res:Response,next:NextFunction){
        try {
            const {id,toDo} = req.params
            console.log(req.params);
            
          console.log(id,toDo);
          
            
            const response = await this.providerDateInteractor.updateCount(id,toDo)
            return res.status(HttpStatus.OK).json(response)
            
        } catch (error) {
            next(error)
        }
    }
}

export default ProviderDateController