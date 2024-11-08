import IadminSettingInteractor from "../../entities/admin/Iadminsettings";
import IAdminRepo from "../../entities/irepositeries/IAdminRepo";
import { IUploadToCloudinary } from "../../entities/services/Iclodinary";
class AdminSettingInteractor implements IadminSettingInteractor {
  constructor(
    private readonly adminRepo: IAdminRepo,
    private readonly Cloudinary: IUploadToCloudinary
  ) { }
  async adminAddvehicleType(
    type: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const exist = await this.adminRepo.vehicleTypealreadyExistOrNot(type);
      if (!exist.success) {
        return { success: false, message: "409" };
      }
      const adminRepovehicleTypeResponse =
        await this.adminRepo.adminSettingsAddvehicleType(type);
      if (adminRepovehicleTypeResponse.success) {
        return { success: true };
      }
      return {
        success: false,
        message: "creation failed something went wrong",
      };
    } catch (error) {
      return { success: false };
    }
  }

  async adminAddBrand(
    brand: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const exist = await this.adminRepo.brandExistOrNot(brand);
      if (!exist.success) {
        return { success: false, message: "409" };
      }
      const response = await this.adminRepo.adminSettingAddBrand(brand);
      if (response.success) {
        return { success: true, message: "created" };
      }
      return { success: false, message: "creation failed" };
    } catch (error) {
      return { success: false };
    }
  }

  async admingetAllSettingsDatas(): Promise<{ success: boolean; brands?: string[]; generalServices?: any[]; roadAssistance?: any[]; }> {
    try {
      const response = await this.adminRepo.settingsDatas();

      if (!response.success) {
        return { success: false };
      }
      return { success: true, brands: response.brands, generalServices: response.generalServices,roadAssistance:response.roadAssistance };
    } catch (error) {
      return { success: false };
    }
  }

  async addGeneralserviceOrRoadAssistance(data: {
    category: "general" | "road";
    servicetype: string;
    image: Buffer | undefined;
  }): Promise<{ success: boolean; message?: string, created?: Object }> {
    try {
      const exist = await this.adminRepo.checkserviceAllreadyExistOrNot(
        data.servicetype
      );
      if (exist.success) {
        return { success: false, message: "409" };
      }

      if (data.image instanceof Buffer) {
        const responseCloudinary = await this.Cloudinary.uploadToCloudinary(
          data.image,
          "FixitHub",
          "FixithubImages"
        );
        if (!responseCloudinary.success) {
          return { success: false };
        }
        const response = await this.adminRepo.addGeneralserviceOrRoadAssistance(
          {
            category: data.category,
            servicetype: data.servicetype,
            imageUrl: responseCloudinary.url ? responseCloudinary.url : "",
          }
        );
        if (!response.success) {
          return { success: response.success, message: response.message };
        }

        return { success: response.success, message: response.message, created: response.created };
      }

      return { success: false, message: "something went wrong" };
    } catch (error) {
      return { success: false };
    }
  }
  async addSubType(data: { id: string; type: string; }): Promise<{ success: boolean; message?: string; }> {
    try {
      const response = await this.adminRepo.addOrUpdateSubType(data)
      if (!response.success) {
        return response
      }
      return response
    } catch (error) {
      return { success: false, message: "500" }
    }
  }
  async deleteSubType(data: { id: string; type: string; }): Promise<{ success: boolean; message?: string; }> {
      try {
        const response = await this.adminRepo.deleteSubType(data)
        return response
      } catch (error) {
        return {success:false,message:"500"}
      }
  }
}

export default AdminSettingInteractor;
