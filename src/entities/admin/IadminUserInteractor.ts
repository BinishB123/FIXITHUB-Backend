import { userdata } from "../../entities/rules/admin";
export interface IAdminInteractor {
    getUserData(): Promise<{
        success: boolean;
        users?: userdata[] | [];
        active?: number;
        blocked?: number;
    }>;
    userBlockAndUnblock(
        id: string,
        state: boolean
    ): Promise<{ success: boolean; message?: string }>;
}
