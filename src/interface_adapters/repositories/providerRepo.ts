import providerModel from "../../framework/mongoose/providerSchema";
import otpModel from "../../framework/mongoose/otpSchema";
import IProviderRepository from "../../entities/irepositeries/iProviderRepo";
import ServiceTypeModel from "../../framework/mongoose/serviceTypes";
import {
  IproviderReponseData,
  NotifyGetterResponse,
  ProviderRegisterData,
  RegisterResponse,
  ResponseAccordingToDate,
  ResponsegetBookingStillTodaysDate,
  ReviewResponse,
  SalesReport,
  SigIn,
  SignResponse,
  UnreadMessageCount,
} from "entities/rules/provider";
import { servicetype, vehicleType } from "../../entities/rules/admin";
import bcrypt from "bcrypt";
import vehicleModel from "../../framework/mongoose/vehicleSchema";
import { ProvidingServices } from "../../entities/provider/IService";
import providingServicesModel from "../../framework/mongoose/providingServicesSchema";
import brandModel from "../../framework/mongoose/brandSchema";
import mongoose from "mongoose";
import CustomError from "../../framework/services/errorInstance";
import HttpStatus from "../../entities/rules/statusCode";
import BookingDateModel from "../../framework/mongoose/BookingDates";
import ServiceBookingModel from "../../framework/mongoose/ServiceBookingModel";
import chatModel from "../../framework/mongoose/ChatSchema";
import messageModel from "../../framework/mongoose/messageSchema";
import reviewModel from "../../framework/mongoose/reviewSchema";

class ProviderRepository implements IProviderRepository {
  async sendOtp(otp: string, email: string): Promise<{ created: boolean }> {
    try {
      const newOtp = await otpModel.create({
        userEmail: email,
        otp: otp,
      });
      if (newOtp) {
        return { created: true };
      }

      return { created: false };
    } catch (error) {
      return { created: false };
    }
  }

  async providerExist(email: string) {
    try {
      const exist = await providerModel.findOne({ email: email });
      if (exist) {
        return true;
      }
      return false;
    } catch (error) {
      return true;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean | null> {
    try {
      const otpIsThereOrSame = await otpModel.findOne({
        userEmail: email,
        otp: otp,
      });
      if (!otpIsThereOrSame) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
  async registerProvider(registerdata: ProviderRegisterData): Promise<{
    created: boolean;
    message: string;
    provider?: RegisterResponse;
  }> {
    try {
      const saltRounds: number = 10;
      const vehicleTypes = await vehicleModel.find();
      const providingService = vehicleTypes.map((data) => {
        return { vehicleType: data._id + "", services: [] };
      });
      const hashedPassword = await bcrypt.hash(
        registerdata.password,
        saltRounds
      );

      const created = await providerModel.create({
        workshopName: registerdata.workshopName,
        ownerName: registerdata.ownerName,
        email: registerdata.email,
        password: hashedPassword,
        mobile: registerdata.mobile,
        workshopDetails: {
          address: registerdata.workshopDetails.address,
          location: {
            type: "Point",
            coordinates: [
              registerdata.workshopDetails.coordinates.long,
              registerdata.workshopDetails.coordinates.lat,
            ],
          },
        },
        blocked: false,
        requestAccept: false,
      });

      if (!created) {
        return { created: false, message: "registration failed" };
      }

      const provider = {
        id: created._id + "",
        ownername: created.ownerName,
        workshopname: created.workshopName,
        email: created.email,
        mobile: created.mobile,
        requested: created.requestAccept,
        blocked: created.blocked,
      };

      return { created: true, message: "register", provider: provider };
    } catch (error) {
      return { created: false, message: "server down" };
    }
  }

  async signInProvider(
    providerSignData: SigIn
  ): Promise<{ success: boolean; message: string; provider?: SignResponse }> {
    try {
      const providerExist = await providerModel.findOne({
        email: providerSignData.email,
      });
      if (!providerExist) {
        return {
          success: false,
          message: "provider not exist with this email",
        };
      }
      const passwordMatch = await bcrypt.compare(
        providerSignData.password,
        providerExist.password
      );
      if (!passwordMatch) {
        return { success: false, message: "incorrect password" };
      }
      if (providerExist.requestAccept === false) {
        return { success: false, message: "registration request not accepted" };
      }

      if (providerExist.requestAccept === null) {
        return { success: false, message: "rejected your request" };
      }
      if (providerExist.blocked === true) {
        return {
          success: false,
          message: "Access denied. Your account has been blocked. ",
        };
      }

      const provider = {
        id: providerExist._id + "",
        ownername: providerExist.ownerName,
        workshopname: providerExist.workshopName,
        email: providerExist.email,
        mobile: providerExist.mobile,
        requested: providerExist.requestAccept,
        blocked: providerExist.blocked,
        logoUrl: providerExist.logoUrl ? providerExist.logoUrl : null,
      };
      return { success: true, message: "provider exist", provider: provider };
    } catch (error) {
      return { success: false, message: "server down" };
    }
  }

  async getProviderServices(
    id: string,
    vehicleType: number
  ): Promise<{
    success: boolean;
    message: string;
    providerService?: ProvidingServices;
    allServices?: servicetype[];
  }> {
    try {
      const allService = await ServiceTypeModel.find().lean();
      const [providerData]: ProvidingServices[] =
        await providingServicesModel.find({ workshopId: id });
      const service = allService.map((service) => ({
        ...service,
        _id: service._id.toString(),
      }));

      return {
        success: true,
        message: "200",
        providerService: providerData,
        allServices: service,
      };
    } catch (error: any) {
      console.log(error.message);

      return { success: false, message: "500" };
    }
  }

  async addGeneralOrRoadService(data: {
    providerid: string;
    typeid: string;
    category: string;
    vehicleType: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      //  service data based on the category (general or road)
      const serviceData = {
        typeId: data.typeid,
        category: data.category,
        subtype: [],
      };

      // Check the vehicle type
      const vehicle = await vehicleModel.findOne<vehicleType>({
        _id: data.vehicleType,
      });

      if (vehicle?.vehicleType === 2) {
        // Two-wheeler
        const provider = await providingServicesModel.findOne({
          workshopId: new mongoose.Types.ObjectId(data.providerid),
          "twoWheeler.typeId": new mongoose.Types.ObjectId(data.typeid),
        });

        if (provider) {
          const updatedProvider = await providingServicesModel.findOneAndUpdate(
            {
              workshopId: new mongoose.Types.ObjectId(data.providerid),
              "twoWheeler.typeId": new mongoose.Types.ObjectId(data.typeid),
            },
            {
              $push: { twoWheeler: serviceData },
            },
            { new: true }
          );

          return {
            success: true,
            message: "Two-wheeler service updated successfully",
          };
        } else {
          const createdProvider = await providingServicesModel.findOneAndUpdate(
            { workshopId: new mongoose.Types.ObjectId(data.providerid) },
            {
              $push: {
                twoWheeler: serviceData,
              },
            },
            { new: true, upsert: true }
          );
          return {
            success: true,
            message: "New two-wheeler service created successfully",
          };
        }
      } else {
        const provider = await providingServicesModel.findOne({
          workshopId: new mongoose.Types.ObjectId(data.providerid),
          "fourWheeler.typeId": new mongoose.Types.ObjectId(data.typeid),
        });

        if (provider) {
          const updatedProvider = await providingServicesModel.findOneAndUpdate(
            {
              workshopId: new mongoose.Types.ObjectId(data.providerid),
              "fourWheeler.typeId": new mongoose.Types.ObjectId(data.typeid),
            },
            {
              $push: { twoWheeler: serviceData },
            },
            { new: true }
          );

          return {
            success: true,
            message: "Four-wheeler service updated successfully",
          };
        } else {
          const createdProvider = await providingServicesModel.findOneAndUpdate(
            { workshopId: new mongoose.Types.ObjectId(data.providerid) },
            {
              $push: {
                fourWheeler: serviceData,
              },
            },
            { new: true, upsert: true }
          );

          return {
            success: true,
            message: "New four-wheeler service created successfully",
          };
        }
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Error occurred while adding or updating service",
      };
    }
  }

  async removeGeneralOrRoadService(data: {
    workshopId: string;
    typeid: string;
    vehicleType: string;
  }): Promise<{ success?: boolean }> {
    try {
      const updateOne = await providingServicesModel.updateOne(
        { workshopId: data.workshopId },
        {
          $pull: {
            [data.vehicleType]: {
              typeId: new mongoose.Types.ObjectId(data.typeid),
            },
          },
        }
      );

      console.log("Update Result:", updateOne);

      if (updateOne.modifiedCount === 0) {
        throw new CustomError(
          "Cannot remove item: No match found or nothing changed.",
          HttpStatus.Unprocessable_Entity
        );
      }
      return { success: true };
    } catch (error) {
      console.error("Error during updateOne operation:", error);
      throw error; // Re-throw to propagate error handling
    }
  }

  async addSubTypes(
    providerid: string,
    serviceid: string,
    newSubType: { type: string; startingprice: number; vehicleType: string }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const newData = {
        type: newSubType.type,
        startingPrice: newSubType.startingprice,
      };

      if (parseInt(newSubType.vehicleType) === 2) {
        // For two-wheelers
        const update = await providingServicesModel.findOneAndUpdate(
          { workshopId: providerid, "twoWheeler.typeId": serviceid },
          { $push: { "twoWheeler.$.subtype": newData } },
          { new: true }
        );

        if (update) {
          console.log("Updated two-wheeler service:", update);
          return {
            success: true,
            message: "Subtype added to two-wheeler successfully",
          };
        }
      } else {
        // For four-wheelers
        const update = await providingServicesModel.findOneAndUpdate(
          { workshopId: providerid, "fourWheeler.typeId": serviceid },
          { $push: { "fourWheeler.$.subtype": newData } },
          { new: true }
        );

        if (update) {
          console.log("Updated four-wheeler service:", update);
          return {
            success: true,
            message: "Subtype added to four-wheeler successfully",
          };
        }
      }

      return { success: false, message: "Failed to update service" };
    } catch (error: any) {
      console.error("Error while adding subtype:", error.message);
      return { success: false, message: "Error occurred while adding subtype" };
    }
  }

  async editSubType(
    providerid: string,
    serviceid: string,
    subtype: { type: string; startingprice: number; vehicleType: string }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updated =
        parseInt(subtype.vehicleType) === 4
          ? await providingServicesModel.updateOne(
              {
                workshopId: providerid,
                "fourWheeler.typeId": serviceid,
                "fourWheeler.subtype.type": subtype.type, // Matching subtype based on type
              },
              {
                $set: {
                  "fourWheeler.$[w].subtype.$[s].startingPrice":
                    subtype.startingprice,
                },
              },
              {
                arrayFilters: [
                  { "w.typeId": serviceid },
                  { "s.type": subtype.type },
                ],
              }
            )
          : await providingServicesModel.updateOne(
              {
                workshopId: providerid,
                "twoWheeler.typeId": serviceid,
                "twoWheeler.subtype.type": subtype.type,
              },
              {
                $set: {
                  "twoWheeler.$[w].subtype.$[s].startingPrice":
                    subtype.startingprice,
                },
              },
              {
                arrayFilters: [
                  { "w.typeId": serviceid },
                  { "s.type": subtype.type },
                ],
              }
            );

      if (updated.modifiedCount > 0) {
        return { success: true, message: "Subtype updated successfully" };
      } else {
        return {
          success: false,
          message: "Subtype not found or no changes made",
        };
      }
    } catch (error: any) {
      console.error("Error while updating subtype:", error.message);
      return {
        success: false,
        message: "Error occurred while updating subtype",
      };
    }
  }

  async deleteSubtype(
    providerid: string,
    serviceid: string,
    subtype: { type: string },
    vehicleType: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const deleted =
        parseInt(vehicleType) === 2
          ? await providingServicesModel.updateOne(
              { workshopId: providerid, "twoWheeler.typeId": serviceid },
              {
                $pull: {
                  "twoWheeler.$.subtype": { type: subtype.type },
                },
              }
            )
          : await providingServicesModel.updateOne(
              { workshopId: providerid, "fourWheeler.typeId": serviceid },
              {
                $pull: {
                  "fourWheeler.$.subtype": { type: subtype.type },
                },
              }
            );

      if (deleted.modifiedCount > 0) {
        return { success: true, message: "Subtype deleted successfully." };
      } else {
        return {
          success: false,
          message: "Subtype not found or already deleted.",
        };
      }
    } catch (error: any) {
      console.error("Error deleting subtype:", error.message);
      return {
        success: false,
        message: "An error occurred while deleting the subtype.",
      };
    }
  }

  async getallBrands(id: string): Promise<{
    succes: boolean;
    message: string;
    brands?: { _id: string; brand: string }[];
    supportedBrands?: { brand: string }[] | [];
  }> {
    try {
      const data = await brandModel.find().lean();
      const [providerData] = await providerModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $project: { _id: 0, supportedBrands: 1 } },
      ]);

      const formattedBrands = data.map((brand) => ({
        _id: brand._id.toString(),
        brand: brand.brand,
      }));

      return {
        succes: true,
        message: "200",
        brands: formattedBrands,
        supportedBrands:
          providerData.supportedBrands.length > 0
            ? providerData.supportedBrands
            : [],
      };
    } catch (error) {
      return { succes: false, message: "500" };
    }
  }

  async addBrands(data: {
    id: string;
    brandid: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const updated = await providerModel.updateOne(
        { _id: new mongoose.Types.ObjectId(data.id) },
        {
          $push: {
            supportedBrands: { brand: data.brandid },
          },
        }
      );
      if (updated.modifiedCount === 1) {
        return { success: true, message: "Brand Added successfully " };
      } else {
        return { success: false, message: "Brand not found or not removed" };
      }
    } catch (error: any) {
      console.log(error.message);

      return { success: false, message: "500" };
    }
  }

  async deleteBrand(data: {
    id: string;
    brandid: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const updated = await providerModel.updateOne(
        { _id: new mongoose.Types.ObjectId(data.id) },
        {
          $pull: {
            supportedBrands: { brand: data.brandid },
          },
        }
      );
      if (updated.modifiedCount === 1) {
        return { success: true, message: "Brand Removed successfully " };
      } else {
        return { success: false, message: "Brand not found or not removed" };
      }
    } catch (error: any) {
      return { success: false, message: "500" };
    }
  }

  async getDataToProfile(id: string): Promise<{
    success: boolean;
    message?: string;
    providerData?: IproviderReponseData | null;
  }> {
    try {
      const aggregateResult = await providerModel.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $project: {
            _id: 1,
            workshopName: 1,
            ownerName: 1,
            email: 1,
            workshopDetails: 1,
            blocked: 1,
            requestAccept: 1,
            supportedBrands: 1,
            logoUrl: 1,
            about: 1,
            mobile: 1,
          },
        },
      ]);

      const getData = aggregateResult[0] as IproviderReponseData | undefined;
      if (!getData) {
        return { success: false, message: "404", providerData: getData };
      }
      return { success: true, message: "200", providerData: getData };
    } catch (error) {
      return { success: false, message: "500" };
    }
  }

  async editabout(data: {
    id: string;
    about: string;
  }): Promise<{ success: boolean; message?: string }> {
    console.log(data.id);
    try {
      const update = await providerModel.updateOne(
        { _id: new mongoose.Types.ObjectId(data.id) },
        {
          $set: {
            about: data.about,
          },
        }
      );
      const d = await providerModel.findOne({ _id: data.id });

      if (update.modifiedCount === 1) {
        return { success: true, message: "updated" };
      }
      return { success: false, message: "422" };
    } catch (error) {
      return { success: false, message: "500" };
    }
  }

  async addImage(data: {
    id: string;
    url: string;
  }): Promise<{ success: boolean; message: string; url?: string }> {
    try {
      const updated = await providerModel.updateOne(
        { _id: data.id },
        {
          $set: {
            logoUrl: data.url,
          },
        }
      );
      if (updated.modifiedCount === 1) {
        return { success: true, message: "updated", url: data.url };
      }
      return { success: false, message: "422" };
    } catch (error) {
      return { success: false, message: "500" };
    }
  }

  async updateProfiledatas(data: {
    id: string;
    whichisTotChange: string;
    newOne: string;
  }): Promise<{ success: boolean; message?: string }> {
    try {
      const updated = await providerModel.updateOne(
        { _id: new mongoose.Types.ObjectId(data.id) },
        {
          $set: {
            [data.whichisTotChange]: data.newOne,
          },
        }
      );
      if (updated.matchedCount === 0) {
        return { success: false };
      }
      return updated.modifiedCount === 1
        ? { success: true, message: "Document updated successfully" }
        : { success: false, message: "No changes were made" };
    } catch (error) {
      console.error("Error updating document:", error);
      return { success: false, message: "500" };
    }
  }

  async getAllBrand(id: string): Promise<{
    success: boolean;
    message?: string;
    brandData?: { _id: string; brand: string }[] | null;
  }> {
    try {
      const brandData = await providerModel.aggregate([
        { $unwind: "$supportedBrands" },
        {
          $lookup: {
            from: "brands",
            localField: "supportedBrands.brand",
            foreignField: "_id",
            as: "providerbrands",
          },
        },
        { $unwind: "$providerbrands" },
        { $project: { _id: 0, providerbrands: 1 } },
      ]);
      if (brandData) {
        return { success: true, message: "200", brandData: brandData };
      }
      return { success: false, message: "" };
    } catch (error) {
      return { success: false, message: "500" };
    }
  }

  async changepassword(data: {
    id: string;
    currentpassowrd: string;
    newpassowrd: string;
  }): Promise<{ success?: boolean; message?: string }> {
    try {
      const provider = await providerModel.findOne({
        _id: new mongoose.Types.ObjectId(data.id),
      });

      if (provider) {
        const passwordMatch = await bcrypt.compare(
          data.currentpassowrd,
          provider.password
        );
        if (!passwordMatch) {
          throw new CustomError("Incorrect Password", HttpStatus.UNAUTHORIZED);
        }
        const saltRounds: number = 10;
        const hashedPassword = await bcrypt.hash(data.newpassowrd, saltRounds);

        const updated = await providerModel.updateOne(
          { _id: data.id },
          {
            $set: {
              password: hashedPassword,
            },
          }
        );

        if (updated.modifiedCount === 1) {
          return { success: true, message: "updated" };
        }
        throw new CustomError(
          "New password must be different from the old password.",
          HttpStatus.CONFLICT
        );
      }
      throw new CustomError("User Not Found", HttpStatus.NOT_FOUND);
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode, error.reasons);
    }
  }

  async updateLogo(
    url: string,
    id: string
  ): Promise<{ success?: boolean; message?: string; url?: string }> {
    try {
      const updated = await providerModel.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        {
          $set: {
            logoUrl: url,
          },
        }
      );
      if (updated.modifiedCount === 0) {
        throw new CustomError(
          "Something Went Wrong While Updating",
          HttpStatus.FORBIDDEN
        );
      }
      return { success: true, url: url };
    } catch (error: any) {
      throw new CustomError(error.message, error.status);
    }
  }

  async addDate(
    date: Date,
    id: string
  ): Promise<{ success?: boolean; id: string }> {
    try {
      const created = await BookingDateModel.create({
        providerid: id,
        date: date,
      });
      if (created) {
        return { success: true, id: created._id + "" };
      }
      throw new CustomError("Date Adding Failed", HttpStatus.BAD_REQUEST);
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async providerAddedDates(id: string): Promise<{
    success?: boolean;
    data: { _id: mongoose.ObjectId; date: Date }[] | [];
  }> {
    try {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 1);
      const data = await BookingDateModel.aggregate([
        {
          $match: {
            providerid: new mongoose.Types.ObjectId(id),
            date: { $gte: date },
          },
        },
        {
          $project: {
            _id: 1,
            date: 1,
            count: 1,
            bookedCount: 1,
          },
        },
        { $sort: { date: 1 } },
      ]);

      return { success: true, data: !data ? [] : data };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async updateCount(id: string, toDo: string): Promise<{ success?: boolean }> {
    try {
      console.log("id", id, "tofo,", toDo);

      const update =
        toDo === "add"
          ? await BookingDateModel.updateOne(
              { _id: new mongoose.Types.ObjectId(id) },
              {
                $inc: {
                  count: 1,
                },
              }
            )
          : await BookingDateModel.updateOne(
              { _id: new mongoose.Types.ObjectId(id), count: { $gt: 0 } },
              {
                $inc: {
                  count: -1,
                },
              }
            );

      if (update.modifiedCount === 1) {
        return { success: true };
      }
      throw new CustomError(
        "Can't Update Something went wrong",
        HttpStatus.BAD_REQUEST
      );
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async getBookingsAccordingToDates(
    id: string,
    date: Date
  ): Promise<{ success?: boolean; data?: ResponseAccordingToDate[] | [] }> {
    try {
      const data: ResponseAccordingToDate[] =
        await ServiceBookingModel.aggregate([
          { $match: { providerId: new mongoose.Types.ObjectId(id) } },
          {
            $lookup: {
              from: "bookingdates",
              localField: "date",
              foreignField: "_id",
              as: "bookeddate",
            },
          },
          { $unwind: "$bookeddate" },

          { $match: { "bookeddate.date": new Date(date) } },

          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $lookup: {
              from: "servicetypes",
              localField: "serviceType",
              foreignField: "_id",
              as: "servicename",
            },
          },
          { $unwind: "$servicename" },
          { $unwind: "$user" },

          {
            $project: {
              _id: 1,
              vechileDetails: 1,
              selectedService: 1,
              advanceAmount: 1,
              advance: 1,
              status: 1,
              amountpaid: 1,
              paymentStatus: 1,
              "user.name": 1,
              "bookeddate.date": 1,
              "servicename.serviceType": 1,
              "user.mobile": 1,
            },
          },
        ]);

      if (data.length === 0) {
        throw new CustomError(
          "No Booking Registerd On this Date",
          HttpStatus.NOT_FOUND
        );
      }

      return { success: true, data: data.length > 0 ? data : [] };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async getBookingStillTodaysDate(
    id: string,
    startIndex: number,
    status?: string
  ): Promise<{
    success?: boolean;
    data?: ResponsegetBookingStillTodaysDate[] | [];
    count: number;
  }> {
    try {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      const query: any = [
        { $match: { providerId: new mongoose.Types.ObjectId(id) } },
        ...(status ? [{ $match: { status: status } }] : []),
        {
          $lookup: {
            from: "bookingdates",
            localField: "date",
            foreignField: "_id",
            as: "bookeddate",
          },
        },
        { $unwind: "$bookeddate" },
        { $sort: { "bookeddate.date": -1 } },
        { $match: { "bookeddate.date": { $lte: date } } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "servicetypes",
            localField: "serviceType",
            foreignField: "_id",
            as: "servicename",
          },
        },
        {
          $lookup: {
            from: "brands",
            localField: "vechileDetails.brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        { $unwind: "$brand" },
        { $unwind: "$servicename" },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            vechileDetails: 1,
            selectedService: 1,
            advanceAmount: 1,
            advance: 1,
            status: 1,
            amountpaid: 1,
            paymentStatus: 1,
            "user._id": 1,
            "user.name": 1,
            "user.logoUrl": 1,
            "bookeddate.date": 1,
            "servicename.serviceType": 1,
            "user.mobile": 1,
            "brand.brand": 1,
            suggestions: 1,
          },
        },
        { $skip: startIndex },
        { $limit: 10 },
      ];

      const data: ResponsegetBookingStillTodaysDate[] =
        await ServiceBookingModel.aggregate(query);
      const count = await ServiceBookingModel.find({
        providerId: new mongoose.Types.ObjectId(id),
      });

      if (data.length === 0) {
        throw new CustomError("No Bookings Registered", HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: data.length > 0 ? data : [],
        count: count.length,
      };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async getBookingGreaterThanTodaysDate(id: string): Promise<{
    success?: boolean;
    data?: ResponsegetBookingStillTodaysDate[] | [];
  }> {
    try {
      const date = new Date();
      date.setHours(0, 0, 0, 0);

      const query: any = [
        { $match: { providerId: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "bookingdates",
            localField: "date",
            foreignField: "_id",
            as: "bookeddate",
          },
        },
        { $unwind: "$bookeddate" },
        { $sort: { "bookeddate.date": -1 } },
        { $match: { "bookeddate.date": { $gt: date } } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "servicetypes",
            localField: "serviceType",
            foreignField: "_id",
            as: "servicename",
          },
        },
        {
          $lookup: {
            from: "brands",
            localField: "vechileDetails.brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        { $unwind: "$brand" },
        { $unwind: "$servicename" },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            vechileDetails: 1,
            selectedService: 1,
            advanceAmount: 1,
            advance: 1,
            status: 1,
            amountpaid: 1,
            paymentStatus: 1,
            "user._id": 1,
            "user.name": 1,
            "user.logoUrl": 1,
            "bookeddate.date": 1,
            "servicename.serviceType": 1,
            "user.mobile": 1,
            "brand.brand": 1,
            suggestions: 1,
          },
        },
      ];

      const data: ResponsegetBookingStillTodaysDate[] =
        await ServiceBookingModel.aggregate(query);

      // if (data.length === 0) {
      //   throw new CustomError("No Bookings Registered", HttpStatus.NOT_FOUND);
      // }

      return { success: true, data: data.length > 0 ? data : [] };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async updateStatus(
    id: string,
    status: string,
    amount: number
  ): Promise<{ success?: boolean; paymentId?: string }> {
    try {
      const update = await ServiceBookingModel.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        {
          $set: {
            status:
              status === "outfordelivery" && amount <= 1000
                ? "completed"
                : status,
          },
        }
      );

      if (update.modifiedCount === 0) {
        throw new CustomError(
          "Updation Failed Something Went Wrong",
          HttpStatus.FORBIDDEN
        );
      }
      const detail = await ServiceBookingModel.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      return status !== "outfordelivery"
        ? { success: true }
        : { success: true, paymentId: detail?.paymentIntentId };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async notificationCountUpdater(id: string): Promise<{ count: number }> {
    try {
      // const bookingReadyToDelivery = await ServiceBookingModel.aggregate([
      //     {$match: { userId: new mongoose.Types.ObjectId(id) } },
      //     {$match: { status: "completed" }},
      //     {$match:{ paymentStatus: "pending" }}
      //   ]);

      const chat = await chatModel.findOne({
        providerId: new mongoose.Types.ObjectId(id),
      });
      const message = await messageModel.aggregate([
        { $match: { chatId: new mongoose.Types.ObjectId(chat?._id + "") } },
        { $match: { sender: "user" } },
        { $match: { seen: false } },
      ]);

      return { count: message.length };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async notificationsGetter(id: string): Promise<{
    notfiyData: NotifyGetterResponse[] | [];
    countOfUnreadMessages: UnreadMessageCount[] | [];
  }> {
    try {
      const querynotifyData = [
        { $match: { providerId: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "messages",
            localField: "latestMessage",
            foreignField: "_id",
            as: "message",
          },
        },
        { $unwind: "$message" },
        { $match: { "message.sender": "user" } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            providerId: 1,
            userId: 1,
            createdAt: 1,
            updatedAt: 1,
            latestMessage: 1,
            message: 1,
            "user.name": 1,
            "user.logoUrl": 1,
          },
        },
      ];

      const querycountOfUnreadMessages = [
        {
          $lookup: {
            from: "chats",
            localField: "chatId",
            foreignField: "_id",
            as: "chat",
          },
        },
        { $unwind: "$chat" },
        {
          $match: {
            $and: [
              { "chat.providerId": new mongoose.Types.ObjectId(id) },
              { sender: "user" },
              { seen: false },
            ],
          },
        },
        { $group: { _id: "$chatId", count: { $sum: 1 } } },
      ];

      const notifyData: NotifyGetterResponse[] | [] =
        await chatModel.aggregate(querynotifyData);
      const countOfUnreadMessages: UnreadMessageCount[] | [] =
        await messageModel.aggregate(querycountOfUnreadMessages);

      return {
        notfiyData: notifyData,
        countOfUnreadMessages: countOfUnreadMessages,
      };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async getFeedBacks(
    providerId: string
  ): Promise<{ feedBacks?: ReviewResponse[] | [] }> {
    try {
      const review: ReviewResponse[] = await reviewModel.aggregate([
        { $match: { ProviderId: new mongoose.Types.ObjectId(providerId) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            userId: 1,
            ServiceId: 1,
            bookingId: 1,
            opinion: 1,
            reply: 1,
            like: 1,
            images: 1,
            "user._id": 1,
            "user.name": 1,
            "user.logoUrl": 1,
          },
        },
      ]);
      return { feedBacks: review ? review : [] };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async likeFeedBack(
    id: string,
    state: boolean
  ): Promise<{ success?: boolean }> {
    try {
      const update = await reviewModel.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        {
          $set: {
            like: state,
          },
        }
      );
      if (update.modifiedCount === 0) {
        throw new CustomError(
          "Updation Failed",
          HttpStatus.Unprocessable_Entity
        );
      }
      return { success: true };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async reply(id: string, reply: string): Promise<{ success?: boolean }> {
    try {
      const update = await reviewModel.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        {
          $set: {
            reply: reply,
          },
        }
      );
      if (update.modifiedCount === 0) {
        throw new CustomError(
          "Updation Failed",
          HttpStatus.Unprocessable_Entity
        );
      }
      return { success: true };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async getMonthlyRevenue(
    id: string
  ): Promise<{ data: { month: string; revenue: number }[] | [] }> {
    try {
      const currentYear = new Date().getFullYear();
      const data = await ServiceBookingModel.aggregate([
        {
          $lookup: {
            from: "bookingdates",
            localField: "date",
            foreignField: "_id",
            as: "bookeddate",
          },
        },
        { $unwind: "$bookeddate" },

        {
          $match: {
            providerId: new mongoose.Types.ObjectId(id),
            paymentStatus: "paid",
            "bookeddate.date": {
              $gte: new Date(`${currentYear}-01-01`),
              $lt: new Date(`${currentYear + 1}-01-01`),
            },
          },
        },
        { $unwind: "$selectedService" },
        {
          $group: {
            _id: { $month: "$date" },
            revenue: { $sum: "$selectedService.price" },
          },
        },
        {
          $project: {
            month: "$_id",
            revenue: 1,
            _id: 0,
          },
        },
        { $sort: { month: 1 } },
      ]);

      return { data: data };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async TopServicesBooked(
    id: string
  ): Promise<{ data: { serviceType: string; count: number }[] | [] }> {
    try {
      const data = await ServiceBookingModel.aggregate([
        { $match: { providerId: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "servicetypes",
            localField: "serviceType",
            foreignField: "_id",
            as: "serviceDetails",
          },
        },
        { $unwind: "$serviceDetails" },
        {
          $group: {
            _id: "$serviceDetails.serviceType",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            serviceType: "$_id",
            count: 1,
            _id: 0,
          },
        },
        { $sort: { count: -1 } },
      ]);
      console.log("data", data);

      return { data: data };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async getSalesReport(
    id: string,
    year: number,
    month: number
  ): Promise<{ report: SalesReport[] | [] }> {
    try {
      

      const data = await ServiceBookingModel.aggregate([
        {
          $match: {
            $and: [
              { providerId: new mongoose.Types.ObjectId(id) },
              { status: "completed" },
              { paymentStatus: "paid" },
            ],
          },
        },
        {
          $lookup: {
            from: "bookingdates",
            localField: "date",
            foreignField: "_id",
            as: "selectedDate",
          },
        },
        { $unwind: "$selectedDate" },
        {
          $match: {
            "selectedDate.date": {
              $gte: new Date(year, month, 1),
              $lt: new Date(year, month + 1, 1),
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "servicetypes",
            localField: "serviceType",
            foreignField: "_id",
            as: "service",
          },
        },
        { $unwind: "$service" },
        {
          $addFields: {
            totalPrice: {
              $reduce: {
                input: "$selectedService",
                initialValue: 0,
                in: { $add: ["$$value", "$$this.price"] },
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            "service.serviceType": 1,
            "user.name": 1,
            "selectedDate.date": 1,
            selectedService: 1,
            totalPrice:1
          },
        },
      ]);

      return { report: data };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }
}

export default ProviderRepository;
