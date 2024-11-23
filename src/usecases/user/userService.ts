import isUserRepository from "../../entities/irepositeries/iUserRepository";
import IuserService from "../../entities/user/IuserServiceInteractor";
import {
  IgetservicesResponse,
  IRequirementToFetchShops,
  ProviderShopSelectedServiceFinalData,
} from "../../entities/user/IuserResponse";
import { ObjectId } from "mongoose";
import CustomError from "../../framework/services/errorInstance";
import { IRequiredDataDForBooking } from "../../entities/rules/user";

class UserServiceInteractor implements IuserService {
  constructor(private readonly userRepo: isUserRepository) {}
  async getServices(
    category: string
  ): Promise<{
    success: boolean;
    message: string;
    services?: IgetservicesResponse[];
  }> {
    try {
      const response = await this.userRepo.getServices(category);
      return response;
    } catch (error) {
      return { success: false, message: "500" };
    }
  }

  async getAllBrand(): Promise<{
    success: boolean;
    message?: string;
    brandData?: { _id: string; brand: string }[] | null;
  }> {
    try {
      const response = await this.userRepo.getAllBrand();
      return response;
    } catch (error) {
      return { success: false, message: "500" };
    }
  }

  async getAllShops(
    data: IRequirementToFetchShops
  ): Promise<{ success: boolean; message?: string; shops?: any[] }> {
    try {
      const response = await this.userRepo.getAllShops(data);
      return response;
    } catch (error) {
      return { success: false, message: "500" };
    }
  }

  async getshopProfileWithSelectedServices(data: {
    serviceId: string;
    vehicleType: string;
    providerId: string;
  }): Promise<{
    success: boolean;
    message?: string;
    shopDetail?: ProviderShopSelectedServiceFinalData;
  }> {
    try {
      const response =
        await this.userRepo.getshopProfileWithSelectedServices(data);

      if (response.shopDetail) {
        const subtypes = [];
        for (let services of response.shopDetail) {
          let finded = null;
          if (data.vehicleType === "twoWheeler") {
            finded = response.service.subTypes.find(
              (service: { type: string; _id: ObjectId }) => {
                if (
                  service._id + "" ===
                  services?.twoWheeler?.subtype?.type + ""
                ) {
                  return service;
                }
              }
            );
          } else {
            finded = response.service.subTypes.find(
              (service: { type: string; _id: ObjectId }) => {
                if (
                  service._id + "" ===
                  services?.fourWheeler?.subtype?.type + ""
                ) {
                  return service;
                }
              }
            );
          }

          if (finded) {
            const subtypeData = {
              typeid: finded._id.toString(),
              typename: finded.type,
              startingprice:
                data.vehicleType === "twoWheeler"
                  ? services.twoWheeler?.subtype.startingPrice
                  : services.fourWheeler?.subtype.startingPrice,
              isAdded: false,
            };
            subtypes.push(subtypeData);
          }
        }

        const providerData: ProviderShopSelectedServiceFinalData = {
          workshopName: response.shopDetail[0].provider.workshopName,
          ownerName: response.shopDetail[0].provider.ownerName,
          email: response.shopDetail[0].provider.email,
          mobile: response.shopDetail[0].provider.mobile,
          workshopDetails: response.shopDetail[0].provider.workshopDetails,
          logoUrl: response.shopDetail[0].provider.logoUrl,
          about: response.shopDetail[0].provider.about,
          selectedService: {
            _id: data.serviceId,
            type: response.service.serviceType,
          },
          services: subtypes,
        };

        return {
          success: true,
          message: "hggsdvfvsdvh",
          shopDetail: providerData,
        };
      }

      return { success: false, message: "Shop details not found" };
    } catch (error) {
      return { success: false, message: "500" };
    }
  }

  async getBookingDates(id: string): Promise<{ success?: boolean; data?: { _id: ObjectId; date: Date; count: number; }[] | []; }> {
      try {
        const response = await this.userRepo.getBookingDates(id)
        return response
      } catch (error:any) {
        throw new CustomError(error.message,error.statusCode)
      }
  }

  async SuccessBooking(data: IRequiredDataDForBooking,sessionId:string): Promise<{ success?: boolean; }> {
    try {
      const response = await this.userRepo.SuccessBooking(data,sessionId)
      return response
    } catch (error:any) {
      throw new CustomError(error.message,error.statusCode)
    }
      
  }
}

export default UserServiceInteractor;
