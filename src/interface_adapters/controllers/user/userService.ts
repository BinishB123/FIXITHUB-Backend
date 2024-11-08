import { Request, Response } from "express";
import IuserServiceInteractor from "../../../entities/user/IuserServiceInteractor";
import HttpStatus from "../../../entities/rules/statusCode";

class UserServiceContoller {
  constructor(private readonly UserServiceInteractor: IuserServiceInteractor) { }
  async getServices(req: Request, res: Response) {
    try {
      const { category } = req.params;
      if (!category) {
        return res
          .status(HttpStatus.Unprocessable_Entity)
          .json({ message: "no category provided" });
      }
      const response = await this.UserServiceInteractor.getServices(category);
      if (!response.success) {
        if (response.message === "500") {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "" });
        }
        return res
          .status(HttpStatus.Unprocessable_Entity)
          .json({ message: "failed data fetching" });
      }

      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed" });
    }
  }

  async getAllBrands(req: Request, res: Response) {
    try {
      const response = await this.UserServiceInteractor.getAllBrand();
      if (!response.success) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: "failed" });
      }
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  async getAllshops(req: Request, res: Response) {
    try {
      console.log(req.query);

      const long = parseFloat(req.query.long + "");
      const lat = parseFloat(req.query.lat + "");

      const data = {
        vehicleType: req.query.vehicleType + "",
        serviceId: req.query.serviceId + "",
        coordinates: [long, lat] as [number, number],
        category: req.query.category + "",
        brand: req.query.brand + ""
      };
      const response = await this.UserServiceInteractor.getAllShops(data);
      if (!response.success) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "failed to Fetch Data" });
      }
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "failed to fetch the data" });
    }
  }

  async getshopProfileWithSelectedServices(req: Request, res: Response) {
    try {

      const data = {
        serviceId: req.query.serviceId+"",
        vehicleType: req.query.vehicleType+"", 
        providerId: req.query.providerId+""
      }
      const response = await this.UserServiceInteractor.getshopProfileWithSelectedServices(data)
      return res.status(HttpStatus.OK).json(response)

    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "failed" })
    }
  }

}

export default UserServiceContoller;
