import {
  IdatasOfGeneralService,
  Iproviders,
  userdata,
} from "../../entities/rules/admin";
import IAdminRepo from "../../entities/irepositeries/IAdminRepo";
import adminModel from "../../framework/mongoose/adminSchema";
import useModel from "../../framework/mongoose/userSchema";
import userModel from "../../framework/mongoose/userSchema";
import providerModel from "../../framework/mongoose/providerSchema";
import vehicleModel from "../../framework/mongoose/vehicleSchema";
import brandModel from "../../framework/mongoose/brandSchema";
import ServiceTypeModel from "../../framework/mongoose/serviceTypes";
import providingServicesModel from "../../framework/mongoose/providingServicesSchema";
import mongoose from "mongoose";
import CustomError from "../../framework/services/errorInstance";
import HttpStatus from "../../entities/rules/statusCode";
import ServiceBookingModel from "../../framework/mongoose/ServiceBookingModel";

class AdminRepository implements IAdminRepo {
  async adminSignIn(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message?: string;
    admin?: { id: string; email: string };
  }> {
    try {
      const admin = await adminModel.findOne({ email: email });

      if (admin && admin.password === password) {
        return {
          success: true,
          admin: { id: admin._id + "", email: admin.email },
        };
      } else {
        return { success: false, message: "invalid password or emailId" };
      }
    } catch (error) {
      return { success: false, message: "something went wrong" };
    }
  }
  async adminGetUserData(): Promise<{
    success: boolean;
    users?: userdata[] | [];
    active?: number;
    blocked?: number;
  }> {
    try {
      const usersData = await useModel.find({}).sort({ _id: -1 });
      if (!usersData) {
        return { success: true, users: [] };
      }

      const [{ active, blocked }] = await userModel.aggregate([
        {
          $group: {
            _id: null,
            // if true 1 else 0
            active: { $sum: { $cond: [{ $eq: ["$blocked", false] }, 1, 0] } },
            blocked: { $sum: { $cond: [{ $eq: ["$blocked", true] }, 1, 0] } },
          },
        },
      ]);

      const formattedUsers: userdata[] = usersData.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        blocked: user.blocked,
      }));

      return {
        success: true,
        users: formattedUsers,
        active: active,
        blocked: blocked,
      };
    } catch (error) {
      return { success: false };
    }
  }
  async adminBlockUnBlockUser(
    id: string,
    state: boolean
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const updated = await userModel.findByIdAndUpdate(id, {
        $set: { blocked: state },
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async getPendingProviders(): Promise<{
    success: boolean;
    message?: string;
    providers?: Iproviders[];
  }> {
    try {
      const providers: Iproviders[] = await providerModel.aggregate([
        {
          $match: {
            requestAccept: false,
          },
        },
        { $sort: { _id: -1 } },
        {
          $project: {
            _id: 1,
            workshopName: 1,
            ownerName: 1,
            mobile: 1,
            workshopDetails: 1,
            blocked: 1,
            requestAccept: 1,
            email: 1,
          },
        },
      ]);

      return { success: true, providers: providers };
    } catch (error) {
      return { success: false, message: "something went wrong" };
    }
  }

  async getProviders(): Promise<{
    success: boolean;
    message?: string;
    providers?: Iproviders[];
  }> {
    try {
      const providers: Iproviders[] = await providerModel.aggregate([
        {
          $match: {
            requestAccept: true,
          },
        },
        { $sort: { _id: -1 } },
        {
          $project: {
            _id: 1,
            workshopName: 1,
            ownerName: 1,
            mobile: 1,
            workshopDetails: 1,
            blocked: 1,
            requestAccept: 1,
            email: 1,
          },
        },
      ]);

      return { success: true, providers: providers };
    } catch (error) {
      return { success: false, message: "something went wrong" };
    }
  }

  async adminRequestAcceptAndReject(
    id: string,
    state: boolean
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const updated = await providerModel.findByIdAndUpdate(id, {
        $set: { requestAccept: state },
      });
      if (state && updated) {
        const created = await providingServicesModel.create({
          workshopId: id,
        });
      }
      if (updated) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }
  async providerBlockOrUnblock(
    id: string,
    state: boolean
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const updated = await providerModel.findByIdAndUpdate(id, {
        $set: { blocked: state },
      });
      if (updated) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }

  async vehicleTypealreadyExistOrNot(
    type: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const exist = await vehicleModel.findOne({ vehicleType: type });
      if (exist) {
        return { success: false };
      }
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async adminSettingsAddvehicleType(
    type: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const vehicleCreated = await vehicleModel.create({ vehicleType: type });
      if (vehicleCreated) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }
  async brandExistOrNot(
    brand: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const exist = await brandModel.findOne({ brand: brand });
      if (exist) {
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async adminSettingAddBrand(
    brand: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const created = await brandModel.create({ brand: brand.trim() });
      if (created) {
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }

  async settingsDatas(): Promise<{
    success: boolean;
    brands?: string[];
    generalServices?: any[];
    roadAssistance?: any[];
  }> {
    try {
      const brands = await brandModel.aggregate([
        { $project: { _id: 0, brand: 1 } },
      ]);
      const generalServices = await ServiceTypeModel.aggregate([
        { $match: { category: "general" } },
        {
          $project: {
            _id: 1,
            serviceType: 1,
            imageUrl: 1,
            category: 1,
            subTypes: 1,
          },
        },
      ]);
      const roadAssistance = await ServiceTypeModel.aggregate([
        { $match: { category: "road" } },
        { $project: { _id: 1, serviceType: 1, imageUrl: 1, category: 1 } },
      ]);

      return {
        success: true,
        brands: brands.length > 0 ? brands : [],
        generalServices: generalServices.length > 0 ? generalServices : [],
        roadAssistance: roadAssistance.length > 0 ? roadAssistance : [],
      };
    } catch (error) {
      return { success: false };
    }
  }
  async checkserviceAllreadyExistOrNot(
    serviceName: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const exist = await ServiceTypeModel.findOne({
        serviceType: serviceName.trim(),
      });
      if (exist) {
        return { success: true, message: "Service already Exist" };
      }
      return { success: false };
    } catch (error) {
      return { success: true, message: "something went wrong" };
    }
  }

  async addGeneralserviceOrRoadAssistance(
    data: IdatasOfGeneralService
  ): Promise<{ success: boolean; message?: string; created?: Object }> {
    try {
      if (data.category === "general") {
        const created = await ServiceTypeModel.create({
          category: data.category,
          serviceType: data.servicetype,
          imageUrl: data.imageUrl,
          subTypes: [],
        });

        const filteredData = {
          category: created.category,
          serviceType: created.serviceType,
          imageUrl: created.imageUrl,
          subTypes: created.subTypes,
          _id: created._id,
        };

        if (created) {
          return { success: true, message: "Created", created: filteredData };
        } else {
          return {
            success: false,
            message: "Failed to create general service type.",
          };
        }
      } else if (data.category === "road") {
        const created = await ServiceTypeModel.create({
          category: data.category,
          serviceType: data.servicetype,
          imageUrl: data.imageUrl,
        });
        const filteredData = {
          category: created.category,
          serviceType: created.serviceType,
          imageUrl: created.imageUrl,
          _id: created._id,
        };
        if (created) {
          return { success: true, message: "Created", created: filteredData };
        } else {
          return {
            success: false,
            message: "Failed to create road service type.",
          };
        }
      }

      return { success: false, message: "" };
    } catch (error) {
      return { success: false, message: "" };
    }
  }

  async addOrUpdateSubType(data: {
    id: string;
    type: string;
  }): Promise<{ success: boolean; message?: string; updatedData?: any }> {
    try {
      const existingDocument = await ServiceTypeModel.findOne({
        _id: data.id,
        "subTypes.type": data.type.trim(),
      });

      let updated;

      if (existingDocument) {
        updated = await ServiceTypeModel.findOneAndUpdate(
          { _id: data.id, "subTypes.type": data.type.trim() },
          { $set: { "subTypes.$.type": data.type.trim() } },
          { new: true }
        );
      } else {
        updated = await ServiceTypeModel.findOneAndUpdate(
          { _id: data.id },
          { $push: { subTypes: { type: data.type.trim() } } },
          { new: true }
        );
      }

      if (!updated) {
        return { success: false, message: "Cannot update or add subType" };
      }
      const newSubtypeId = updated.subTypes[updated.subTypes.length - 1];
      return { success: true, updatedData: newSubtypeId };
    } catch (error) {
      console.log(error);
      return { success: false, message: "500" };
    }
  }

  async deleteSubType(data: {
    id: string;
    type: string;
  }): Promise<{ success: boolean; message?: string }> {
    try {
      const deleted = await ServiceTypeModel.updateOne(
        { _id: data.id },
        { $pull: { subTypes: { _id: data.type } } }
      );

      if (deleted.modifiedCount === 0) {
        return { success: false, message: "409" };
      }
      return { success: true, message: "deleted" };
    } catch (error) {
      return { success: false, message: "500" };
    }
  }

  async editServiceName(data: {
    id: string;
    newName: string;
  }): Promise<{ success: boolean }> {
    try {
      const updated = await ServiceTypeModel.updateOne(
        { _id: new mongoose.Types.ObjectId(data.id) },
        {
          $set: { serviceType: data.newName },
        }
      );
      if (updated.modifiedCount === 0) {
        throw new CustomError(
          "updation failed try again",
          HttpStatus.NO_CONTENT
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
            // paymentStatus: "paid",
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
            revenue: { $sum: 50 },
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

      return { data: data };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }
}

export default AdminRepository;
