import { Request, response, Response } from "express";
import IproviderServiceInteractor from "../../../entities/provider/IproviderService";
import HttpStatus from "../../../entities/rules/statusCode";

class ProviderAddServiceController {
  constructor(
    private readonly providerServiceInteractor: IproviderServiceInteractor
  ) { }
  async getProviderAllService(req: Request, res: Response) {

    const id = req.query.id as string || "";
    const number = req.query.type as string || "";


    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Provider ID is required.",
      });
    }

    try {
      const response =
        await this.providerServiceInteractor.getProviderServices(id, parseInt(number));
      res.status(response.success ? HttpStatus.OK : HttpStatus.NOT_FOUND).json(response);
    } catch (error) {
      console.error("Error fetching provider services:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching provider services.",
      });
    }
  }
  async addGeneralOrRoadService(req: Request, res: Response) {
    try {
      const { id, typeid, category, vechileType } = req.body
      const data = {
        providerid: id,
        typeid: typeid,
        category: category,
        vechileType: vechileType
      }
      const response = await this.providerServiceInteractor.addGeneralOrRoadService(data)


      if (!response.success) {
        if (response.message === "500") {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "internal server Error" })
        }
        return res.status(HttpStatus.Unprocessable_Entity).json({ message: "creation failed" })
      }
      return res.status(HttpStatus.OK).json({ message: "ok" })
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error" })
    }
  }


  async addSubTypes(req: Request, res: Response) {
    try {
      const { serviceid, providerId, newSubtype } = req.body


      const response = await this.providerServiceInteractor.addSubTypes(providerId, serviceid, newSubtype)
      if (response.success) {
        return res.status(HttpStatus.OK).json({ message: "success" })
      }
      return res.status(HttpStatus.Unprocessable_Entity).json({ message: "failed" })
    } catch (error: any) {
      console.log("errr", error.message);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "internal server Error" })
    }
  }

  async editSubType(req: Request, res: Response) {
    try {
      const { serviceid, providerId, newSubtype } = req.body
      const response = await this.providerServiceInteractor.editSubType(providerId, serviceid, newSubtype)
      if (response.success) {
        return res.status(HttpStatus.OK).json({ success: true, message: "success" })
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "failed" })
    }
  }

  async deleteSubTpe(req: Request, res: Response) {
    try {
      const serviceid = req.query.serviceid as string; 
      const providerId = req.query.providerId as string; 
      const type = req.query.type as string; 
      const servicetype = req.query.servicetype as string
  console.log(req.query);
  

      const newsubtype = {
        type: servicetype
      }
      const response = await this.providerServiceInteractor.deleteSubtype(providerId, serviceid, newsubtype, type)
      if (response.success) {
        return res.status(HttpStatus.OK).json({ success: true, message: "success" })
      }
      return res.status(HttpStatus.FORBIDDEN).json({ success: false, message: "failed" })

    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "failed" })

    }
  }
  async getallBrands(req:Request,res:Response){
         try {
          const id = req.query.id as string
          
          
          const response = await this.providerServiceInteractor.getallBrands(id)
          if (!response.succes) {
             if (response.message==="500") {
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
             }
          }
          return res.status(HttpStatus.OK).json(response)
         } catch (error) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"failed"})
         }
  }

  async addBrands(req:Request,res:Response){
    try {
      const {id,brandid} = req.body
      const response = await this.providerServiceInteractor.addBrands({id,brandid})
      if (response.success) {
        return res.status(HttpStatus.OK).json({success:"added"})
      }else{
        return res.status(HttpStatus.Unprocessable_Entity).json({message:"failed"})
      }      
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    }
  }

  async deleteBrand(req:Request,res:Response){
    try {
      const {id,brandid} = req.body
      const response = await this.providerServiceInteractor.deleteBrands({id,brandid})
      if (response.success) {
        return res.status(HttpStatus.OK).json({success:"added"})
      }else{
        return res.status(HttpStatus.Unprocessable_Entity).json({message:"failed"})
      }      
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response)
    }
  }


}


export default ProviderAddServiceController