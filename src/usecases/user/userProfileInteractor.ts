import CustomError from "../../framework/services/errorInstance";
import isUserRepository from "../../entities/irepositeries/iUserRepository";
import IUserProfileInteractor from "../../entities/user/IuserProfileInteractor";
import { INotifyGetterResponse, reportData } from "entities/user/IuserResponse";

class UserProfileInteractor implements IUserProfileInteractor {
  constructor(private readonly userRepo: isUserRepository) { }
  async userUpdateData(data: {
    id: string;
    newData: string;
    whichToChange: string;
  }): Promise<{ success?: boolean; message?: string; newData?: string }> {
    try {
      const response = await this.userRepo.userUpdateData(data);
      return response;
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async addOrChangePhoto(data: {
    id: string;
    url?: string;
  }): Promise<{ success?: boolean; message?: string; url?: string }> {
    try {
      const response = await this.userRepo.addOrChangePhoto(data);
      return response;
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async notificationCountUpdater(id: string): Promise<{ count: number }> {
    try {
      const response = await this.userRepo.notificationCountUpdater(id);
      return response;
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }

  async notificationsGetter(
    id: string
  ): Promise<{ notfiyData: INotifyGetterResponse[] | [] }> {
    try {
      const response = await this.userRepo.notificationsGetter(id);

      if (
        response.countOfUnreadMessages.length > 0 &&
        response.notfiyData.length > 0
      ) {
        const data: INotifyGetterResponse[] = response.notfiyData.map(
          (data) => {
            const matchedItem = response.countOfUnreadMessages.find(
              (item) => item._id + "" === data._id + ""
            );
            return { ...data, count: matchedItem ? matchedItem.count : 1 };
          }
        );

        return { notfiyData: data };
      }
      return { notfiyData: [] };
    } catch (error: any) {
      throw new CustomError(error.message, error.statusCode);
    }
  }
  
  async createReport(data: reportData): Promise<{ success?: boolean; }> {
      try {
         const response = await this.userRepo.createReport({...data})
         return response
        
      } catch (error: any) {
        throw new CustomError(error.message, error.statusCode);
      }
  }

  async getReport(id: string): Promise<{ data: reportData[] | []; }> {
    try {
      const response = await this.userRepo.getReport(id)
      return response
     
   } catch (error: any) {
     throw new CustomError(error.message, error.statusCode);
   }
      
  }

}

export default UserProfileInteractor;
