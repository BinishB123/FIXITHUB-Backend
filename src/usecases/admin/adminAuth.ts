import { Ijwtservices } from "../../entities/services/Ijwt";
import IAdminInteractor from "../../entities/admin/IAuth";
import IAdminRepo from "../../entities/irepositeries/IAdminRepo";

class AdminAuthInteractor implements IAdminInteractor {
    constructor(private readonly adminRepo: IAdminRepo, private readonly jwtservice: Ijwtservices) { }
    async signIn(email: string, password: string): Promise<{ success: boolean; message?: string, accessToken?: string, refreshToken?: string }> {
        try {
            const response = await this.adminRepo.adminSignIn(email, password)
            if (!response.success) {
                return { success: false, message: response.message }
            }
            const accessToken = await this.jwtservice.generateToken({ id: response.admin?.id, email: response.admin?.email, role: "admin" }, { expiresIn: '1h' })
            const refreshToken = await this.jwtservice.generateRefreshToken({ id: response.admin?.id, email: response.admin?.email, role: "admin" }, { expiresIn: '1d' })
            return { success: true, accessToken: accessToken, refreshToken: refreshToken }
        } catch (error) {
            return { success: false, message: "something went wrong" }
        }
    }
}

export default AdminAuthInteractor