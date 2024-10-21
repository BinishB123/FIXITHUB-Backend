import isUserRepository from "../../entities/irepositeries/iUserRepository";
import IuserService from "../../entities/user/IuserServiceInteractor";
import { IgetservicesResponse } from "../../entities/user/IuserResponse";

class UserServiceInteractor implements IuserService{
    constructor(private readonly userRepo:isUserRepository){}
     async getServices(category: string): Promise<{ success: boolean; message: string; services?: IgetservicesResponse[]; }> {
          try {
            const response = await this.userRepo.getServices(category)
            return response
            
          } catch (error) {
            return {success:false,message:"500"}
          }
    }

}

export default UserServiceInteractor