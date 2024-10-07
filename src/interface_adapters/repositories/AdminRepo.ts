import { Iproviders, userdata } from "../../entities/rules/admin";
import IAdminRepo from "../../entities/irepositeries/IAdminRepo";
import adminModel from "../../framework/mongoose/adminSchema";
import useModel from '../../framework/mongoose/userSchema'
import userModel from "../../framework/mongoose/userSchema";
import providerModel from "../../framework/mongoose/providerSchema";

class AdminRepository implements IAdminRepo {
    async adminSignIn(email: string, password: string): Promise<{ success: boolean, message?: string }> {
        try {
            const admin = await adminModel.findOne({ email: email })

            if (admin && admin.password === password) {
                return { success: true }
            } else {
                return { success: false, message: "invalid password or emailId" }
            }

        } catch (error) {
            return { success: false, message: "something went wrong" }
        }
    }
    async adminGetUserData(): Promise<{ success: boolean; users?: userdata[] | []; active?: number; blocked?: number; }> {
        try {
            const usersData = await useModel.find({}).sort({ _id: -1 })
            if (!usersData) {
                return { success: true, users: [] }
            }


            const [{ active, blocked }] = await userModel.aggregate([{
                $group: {
                    _id: null,
                    // if true 1 else 0
                    active: { $sum: { $cond: [{ $eq: ["$blocked", false] }, 1, 0] } },
                    blocked: { $sum: { $cond: [{ $eq: ["$blocked", true] }, 1, 0] } }
                }
            }])



            const formattedUsers: userdata[] = usersData.map(user => ({
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                blocked: user.blocked,

            }));



            return { success: true, users: formattedUsers, active: active, blocked: blocked };
        } catch (error) {
            return { success: false }
        }
    }
    async adminBlockUnBlockUser(id: string, state: boolean): Promise<{ success: boolean; message?: string; }> {
        try {
            const updated = await userModel.findByIdAndUpdate(id, { $set: { blocked: state } })
            return { success: true }
        } catch (error) {
            return { success: false }
        }
    }

    async getPendingProviders(): Promise<{ success: boolean; message?: string; providers?: Iproviders[]; }> {
        try {

            const providers: Iproviders[] = await providerModel.aggregate([
                {
                    $match: {
                        requestAccept: false
                    }
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
                        email: 1
                    }
                }
            ]);



            return { success: true, providers: providers }

        } catch (error) {
            return { success: false, message: "something went wrong" }
        }
    }

    async getProviders(): Promise<{ success: boolean; message?: string; providers?: Iproviders[]; }> {
        try {

            const providers: Iproviders[] = await providerModel.aggregate([
                {
                    $match: {
                        requestAccept: true
                    }
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
                        email: 1
                    }
                }
            ]); 
            
            

            return { success: true, providers: providers }

        } catch (error) {
            return { success: false, message: "something went wrong" }
        }
    }


    async adminRequestAcceptAndReject(id: string, state: boolean): Promise<{ success: boolean; message?: string; }> {
        try {
            const updated = await providerModel.findByIdAndUpdate(id, { $set: { requestAccept: state } })
            if (updated) {
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            return { success: false }
        }
    }
    async providerBlockOrUnblock(id: string, state: boolean): Promise<{ success: boolean; message?: string; }> {
        try {
            console.log("bvvb",id,state);
            
            const updated = await providerModel.findByIdAndUpdate(id, { $set: { blocked: state } })
            console.log(updated);
            
            if (updated) {
                return { success: true }
            }
            return { success: false }
        } catch (error) {
            return { success: false }
        }
        
    }
}


export default AdminRepository