import { IAdminInteractor } from "../../entities/admin/IadminUserInteractor";
import IAdminRepo from "../../entities/irepositeries/IAdminRepo";
import { userdata } from "../../entities/rules/admin";



class AdminUserInteractor implements IAdminInteractor {
    constructor(private readonly adminUserRepo: IAdminRepo) { }
    async getUserData(): Promise<{ success: boolean; users?: userdata[] | [],active?:number,blocked?:number }> {
        try {
            const response = await this.adminUserRepo.adminGetUserData()
            if (!response.success) {
                return { success: false }
            }
            return { success: true, users: response.users,active:response.active,blocked:response.blocked }
        } catch (error) {
            return { success: false }
        }

    }
    async userBlockAndUnblock(id:string,state:boolean): Promise<{ success: boolean; message?: string; }> {
        try {
            const response = await this.adminUserRepo.adminBlockUnBlockUser(id,state)
            return {success:true,message:""}
        } catch (error) {
            return {success:true}
        }
    }
}


export default AdminUserInteractor