import { NextFunction, Request, Response } from "express";
import IuserServiceInteractor from "../../../entities/user/IuserServiceInteractor";
import HttpStatus from "../../../entities/rules/statusCode";
import IStripe from "../../../entities/services/Istripe";
import { IUploadToCloudinary } from "../../../entities/services/Iclodinary";
import CustomError from "../../../framework/services/errorInstance";



class UserServiceContoller {
  constructor(private readonly UserServiceInteractor: IuserServiceInteractor, private readonly stripe: IStripe, private readonly cloduinary: IUploadToCloudinary) { }
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
        serviceId: req.query.serviceId + "",
        vehicleType: req.query.vehicleType + "",
        providerId: req.query.providerId + ""
      }
      const response = await this.UserServiceInteractor.getshopProfileWithSelectedServices(data)
      return res.status(HttpStatus.OK).json(response)

    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "failed" })
    }
  }

  async getBookingDates(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const response = await this.UserServiceInteractor.getBookingDates(id)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  }


  async checkOut_Session(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataRequiredBooking, initailAmountToPay } = req.body
      req.session.dataRequiredForBooking = dataRequiredBooking
      console.log(req.session.dataRequiredForBooking);
      req.session.save()
      const response = await this.stripe.userCheckoutSession(initailAmountToPay)
      return res.status(HttpStatus.OK).json({ sessionId: response.sessionid, url: response.url });
    } catch (error: any) {
      next(error);
    }
  }

  async getLatestBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { userid, startindex, endindex } = req.params
      const response = await this.UserServiceInteractor.getLatestBooking(userid)
      return res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  }

  async getServiceHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { userid, startindex, endindex } = req.params
      const response = await this.UserServiceInteractor.getServiceHistory(userid, parseInt(startindex), parseInt(endindex))
      return res.status(HttpStatus.OK).json(response)
    } catch (error: any) {
      next(error)
    }
  }

  async fullpayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { selectedServices, docId } = req.body
      const response = await this.stripe.fullpayment(selectedServices, docId)
      return res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  }

  async cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, amountToRefund, date } = req.body
      const response = await this.UserServiceInteractor.cancelBooking(id, amountToRefund, date)
      return res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }
  }


  async addReview(req: Request, res: Response, next: NextFunction) {
    try {

      const { userId, providerId, serviceId, review, bookingId } = req.body
      const images: Buffer[] = []
      if (Array.isArray(req.files)) {
        req.files.forEach((file: any) => {
          images.push(file.buffer);
        });
      }

      this.cloduinary.uploadArrayOfImages(images, "FixitHub", "FixithubImages").then(async (response) => {

        const resp = await this.UserServiceInteractor.addReview({ userId, providerId, serviceId, review, bookingId }, response.results)
        console.log("res", resp);

        return res.status(HttpStatus.OK).json(resp)
      }).catch((error) => {
        throw new CustomError("Image Adding Failed While AddingReview", HttpStatus.INTERNAL_SERVER_ERROR)
      })

    } catch (error) {
      next(error)
    }

  }


  async getReviewDeatils(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
   
      const response = await this.UserServiceInteractor.getReviewDetails(id)
      return res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }

  }

  async deleteOneImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, url } = req.params
      this.cloduinary.deleteFromCloudinary(url, "FixitHub").then(async () => {
        const response = await this.UserServiceInteractor.deleteOneImage(id, url)
        return res.status(HttpStatus.OK).json(response)
      })
    } catch (error) {
      next(error)
    }

  }

  async editReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, newReview } = req.body
      const response = await this.UserServiceInteractor.editReview(id, newReview)
      return res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error)
    }

  }

  async addOneImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.body
      const image = req.file?.buffer;
      if (image instanceof Buffer) {
        const cloudinaryresponse = await this.cloduinary.uploadToCloudinary(
          image,
          "FixitHub",
          "FixithubImages"
        );
        if (cloudinaryresponse.success) {
          const response = await this.UserServiceInteractor.addOneImage(id, cloudinaryresponse.url ? cloudinaryresponse.url : "",)
          if (response.success) {
            return res.status(HttpStatus.OK).json({ url: response.url });
          }
        }
      }

    } catch (error) {
      next(error)
    }

  }






}

export default UserServiceContoller;
