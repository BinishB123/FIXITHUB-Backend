import CustomError from "../../framework/services/errorInstance";
import isUserRepository from "../../entities/irepositeries/iUserRepository";
import IUserProfileInteractor from "../../entities/user/IuserProfileInteractor";


class UserProfileInteractor implements IUserProfileInteractor{
    constructor(private readonly userRepo :isUserRepository){}
    async userUpdateData(data: { id: string; newData: string; whichToChange: string; }): Promise<{ success?: boolean; message?: string; newData?: string; }> {
        try {
            const response = await this.userRepo.userUpdateData(data)
            return response
        } catch (error:any) {
            throw new CustomError(error.message,error.statusCode)
        }
    }

    async addOrChangePhoto(data: { id: string; url?: string; }): Promise<{ success?: boolean; message?: string; url?: string; }> {
        try {
            
              const response = await this.userRepo.addOrChangePhoto(data)
              return response
            
        } catch (error:any) {
            throw new CustomError(error.message,error.statusCode)
        }
    }
}

export default UserProfileInteractor