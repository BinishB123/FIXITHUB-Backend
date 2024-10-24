import providerModel from "../../framework/mongoose/providerSchema";
import otpModel from "../../framework/mongoose/otpSchema";
import IProviderRepository from "entities/irepositeries/iProviderRepo";
import ServiceTypeModel from "../../framework/mongoose/serviceTypes";
import {
  IproviderReponseData,
  ProviderRegisterData,
  RegisterResponse,
  SigIn,
  SignResponse,
} from "entities/rules/provider";
import { servicetype, VechileType } from "entities/rules/admin";
import bcrypt from "bcrypt";
import vechileModel from "../../framework/mongoose/vechileSchema";
import { ProvidingServices } from "../../entities/provider/IService";
import providingServicesModel from "../../framework/mongoose/providingServicesSchema";
import brandModel from "../../framework/mongoose/brandSchema";
import mongoose from "mongoose";

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
      const vechileTypes = await vechileModel.find();
      const providingService = vechileTypes.map((data) => {
        return { vechileType: data._id + "", services: [] };
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
        workshopDetails: registerdata.workshopDetails,
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
      };
      return { success: true, message: "provider exist", provider: provider };
    } catch (error) {
      return { success: false, message: "server down" };
    }
  }

  async getProviderServices(
    id: string,
    vechileType: number
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
    vechileType: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      //  service data based on the category (general or road)
      const serviceData = {
        typeId: data.typeid,
        category: data.category,
        subtype: [],
      };

      // Check the vehicle type
      const vechile = await vechileModel.findOne<VechileType>({
        _id: data.vechileType,
      });

      if (vechile?.vechileType === 2) {
        // Two-wheeler
        const provider = await providingServicesModel.findOne({
          workshopId: data.providerid,
          "twoWheeler.typeId": data.typeid,
        });

        if (provider) {
          const updatedProvider = await providingServicesModel.findOneAndUpdate(
            { workshopId: data.providerid, "twoWheeler.typeId": data.typeid },
            {
              $push: { "twoWheeler.$": serviceData }, // Replace the existing service data
            },
            { new: true }
          );
          console.log("Updated two-wheeler service:", updatedProvider);
          return {
            success: true,
            message: "Two-wheeler service updated successfully",
          };
        } else {
          const createdProvider = await providingServicesModel.findOneAndUpdate(
            { workshopId: data.providerid },
            {
              $push: {
                twoWheeler: serviceData, // Add the new service
              },
            },
            { new: true, upsert: true }
          );
          console.log("Created new two-wheeler service:", createdProvider);
          return {
            success: true,
            message: "New two-wheeler service created successfully",
          };
        }
      } else {
        // Four-wheeler
        const provider = await providingServicesModel.findOne({
          workshopId: data.providerid,
          "fourWheeler.typeId": data.typeid,
        });

        if (provider) {
          // Update the existing four-wheeler service by replacing it
          const updatedProvider = await providingServicesModel.findOneAndUpdate(
            { workshopId: data.providerid, "fourWheeler.typeId": data.typeid },
            {
              $push: { "fourWheeler.$": serviceData }, // Replace the existing service data
            },
            { new: true }
          );
          console.log("Updated four-wheeler service:", updatedProvider);
          return {
            success: true,
            message: "Four-wheeler service updated successfully",
          };
        } else {
          // Create a new four-wheeler service entry
          const createdProvider = await providingServicesModel.findOneAndUpdate(
            { workshopId: data.providerid },
            {
              $push: {
                fourWheeler: serviceData,
              },
            },
            { new: true, upsert: true }
          );
          console.log("Created new four-wheeler service:", createdProvider);
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

  async addSubTypes(
    providerid: string,
    serviceid: string,
    newSubType: { type: string; startingprice: number; vechileType: string }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const newData = {
        type: newSubType.type,
        startingPrice: newSubType.startingprice,
      };

      if (parseInt(newSubType.vechileType) === 2) {
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
    subtype: { type: string; startingprice: number; vechileType: string }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updated =
        parseInt(subtype.vechileType) === 4
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
    vechileType: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const deleted =
        parseInt(vechileType) === 2
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

  async getallBrands(
    id: string
  ): Promise<{
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

  async getDataToProfile(
    id: string
  ): Promise<{
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
    try {
      const update = await providerModel.updateOne(
        { id: data.id },
        {
          $set: {
            about: data.about,
          },
        }
      );

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
  
}

export default ProviderRepository;
