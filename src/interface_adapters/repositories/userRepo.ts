import { Provider, user, userResponseData, userSignIn } from "../../entities/rules/user";
import isUserRepository from "../../entities/irepositeries/iUserRepository";
import otpModel from "../../framework/mongoose/otpSchema";
import userModel from "../../framework/mongoose/userSchema";
import bcrypt from "bcrypt";
import ServiceTypeModel from "../../framework/mongoose/serviceTypes";
import {
    IgetservicesResponse,
    IRequirementToFetchShops,
} from "../../entities/user/IuserResponse";
import brandModel from "../../framework/mongoose/brandSchema";
import providerModel from "../../framework/mongoose/providerSchema";
import mongoose from "mongoose";
import providingServicesModel from "../../framework/mongoose/providingServicesSchema";
import HttpStatus from "../../entities/rules/statusCode";
import CustomError from "../../framework/services/errorInstance";

class UserRepository implements isUserRepository {
    // this method is for saving the otp in dbs
    //temperory otp saving in dbs ttl
    async tempOTp(otp: string, email: string): Promise<{ created: boolean }> {
        const newotp = await otpModel.create({
            userEmail: email,
            otp: otp,
        });
        if (newotp) {
            return { created: true };
        }
        return { created: false };
    }
    //this method is for checking the user with given email is exist or not
    // userexist
    async userexist(email: string): Promise<boolean> {
        const userExist = await userModel.findOne({ email: email.trim() });

        if (!userExist) {
            return false;
        } else {
            return true;
        }
    }

    async otpverification(email: string, otp: string): Promise<boolean> {
        const otpverifed = await otpModel.findOne({ otp: otp, email: email });

        if (otpverifed !== null) {
            return true;
        } else {
            return false;
        }
    }

    // creating the user after otp verification
    async signup(
        userData: user
    ): Promise<{ user: userResponseData; created: boolean }> {
        const saltRounds: number = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        const userCreated = await userModel.create({
            name: userData.name,
            mobile: userData.mobile,
            email: userData.email,
            password: hashedPassword,
            blocked: false,
        });
        const user = {
            id: userCreated._id + "",
            name: userCreated.name,
            email: userCreated.email,
            mobile: userCreated.mobile + "",
            logoUrl: userCreated.logoUrl,
            blocked: userCreated.blocked,
        };

        if (userCreated) {
            return { user: user, created: true };
        } else {
            return { user: user, created: false };
        }
    }

    async signin(
        userData: userSignIn
    ): Promise<{ user?: userResponseData; success: boolean; message?: string }> {
        const findedUser = await userModel.findOne({
            email: userData.email.trim(),
        });

        if (!findedUser) {
            return { success: false, message: "incorrect email" };
        }
        const passwordMatch = await bcrypt.compare(
            userData.password,
            findedUser.password
        );
        if (!passwordMatch) {
            return { success: false, message: "password is incorrect" };
        }
        if (findedUser.blocked) {
            return {
                success: false,
                message: "Access denied. Your account is blocked",
            };
        }

        const user: userResponseData = {
            id: findedUser._id.toString(),
            name: findedUser.name,
            email: findedUser.email,
            mobile: findedUser.mobile + "",
            logoUrl: findedUser.logoUrl,
            blocked: findedUser.blocked,
        };

        return { user: user, success: true };
    }
    async checker(id: string): Promise<{ success?: boolean; message?: string; }> {
        try {
            const checker = await userModel.findOne({ _id: new mongoose.Types.ObjectId(id) })
            if (!checker || checker.blocked) {
                throw new CustomError("Permission Denied", HttpStatus.UNAUTHORIZED);
            }
            return { success: true }
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode, error.reasons)
        }
    }

    async getServices(
        category: string
    ): Promise<{
        success: boolean;
        message: string;
        services?: IgetservicesResponse[];
    }> {
        try {
            const response: IgetservicesResponse[] = await ServiceTypeModel.aggregate(
                [
                    { $match: { category: category } },
                    { $project: { _id: 1, category: 1, serviceType: 1, imageUrl: 1 } },
                ]
            );
            return {
                success: response ? true : false,
                message: "success",
                services: response,
            };
        } catch (error) {
            return { success: false, message: "500" };
        }
    }

    async getAllBrand(): Promise<{
        success: boolean;
        message?: string;
        brandData?: { _id: string; brand: string }[] | null;
    }> {
        try {
            const brand = await brandModel.find().sort({ brand: 1 }).lean();
            const brands = brand.map((item) => {
                return { _id: item._id + "", brand: item.brand };
            });
            return { success: true, brandData: brands };
        } catch (error) {
            return { success: false, message: "500" };
        }
    }

    async getAllShops(
        data: IRequirementToFetchShops
    ): Promise<{ success: boolean; message?: string; shops?: any[] }> {
        try {
            const shops = await providerModel.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: data.coordinates },
                        distanceField: "distance",
                        maxDistance: 30000,
                        spherical: true,
                    },
                },
                {
                    $lookup: {
                        from: "providingservices",
                        localField: "_id",
                        foreignField: "workshopId",
                        as: "providing_service",
                    },
                },
                { $unwind: "$providing_service" },
                {
                    $match: {
                        [`providing_service.${data.vehicleType}`]: { $ne: [] },
                    },
                },
                { $unwind: `$providing_service.${data.vehicleType}` },
                {
                    $match: {
                        [`providing_service.${data.vehicleType}.typeId`]:
                            new mongoose.Types.ObjectId(data.serviceId),
                        [`providing_service.${data.vehicleType}.subtype`]: { $ne: [] },
                        supportedBrands: {
                            $elemMatch: { brand: new mongoose.Types.ObjectId(data.brand) },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        workshopName: 1,
                        distance: 1,
                        logoUrl: { $ifNull: ["$logoUrl", null] },
                    },
                },
            ]);
            return { success: true, shops };
        } catch (error: any) {
            console.log(error);

            return { success: false, message: "500" };
        }
    }



    async getshopProfileWithSelectedServices(data: { serviceId: string; vehicleType: string; providerId: string; }): Promise<{ success: boolean; message?: string; shopDetail?: Provider[] | []; service?: { _id: mongoose.ObjectId; category: string; serviceType: string; imageUrl: string; subTypes: { type: string; _id: mongoose.ObjectId; }[] } | any }> {
        try {

            const serviceType = await ServiceTypeModel.findOne({
                _id: new mongoose.Types.ObjectId(data.serviceId),
            }) || null;

            if (!serviceType) {
                return { success: false, message: "Service type not found", shopDetail: [] };
            }
            const shopData: Provider[] = data.vehicleType === "twoWheeler"
                ? await providingServicesModel.aggregate([
                    { $match: { workshopId: new mongoose.Types.ObjectId(data.providerId) } },
                    {
                        $lookup: {
                            from: "providers",
                            localField: "workshopId",
                            foreignField: "_id",
                            as: "provider",
                        },
                    },
                    { $unwind: "$twoWheeler" },
                    { $match: { "twoWheeler.typeId": new mongoose.Types.ObjectId(data.serviceId) } },
                    { $unwind: "$provider" },
                    { $unwind: "$twoWheeler.subtype" },
                    {
                        $project: {
                            "provider": {
                                workshopName: 1,
                                ownerName: 1,
                                email: 1,
                                mobile: 1,
                                logoUrl: 1,
                                about: 1,
                                workshopDetails: 1
                            },

                            "workshopId": 1,
                            "twoWheeler": 1,
                        },
                    },



                ]) || []
                : await providingServicesModel.aggregate([
                    { $match: { workshopId: new mongoose.Types.ObjectId(data.providerId) } },
                    {
                        $lookup: {
                            from: "providers",
                            localField: "workshopId",
                            foreignField: "_id",
                            as: "provider",
                        },
                    },
                    { $unwind: "$fourWheeler" },
                    { $match: { "fourWheeler.typeId": new mongoose.Types.ObjectId(data.serviceId) } },
                    { $unwind: "$provider" },
                    { $unwind: "$fourWheeler.subtype" },
                    {
                        $project: {
                            "provider": {
                                workshopName: 1,
                                ownerName: 1,
                                email: 1,
                                mobile: 1,
                                logoUrl: 1,
                                about: 1,
                                workshopDetails: 1


                            },
                            "workshopDetails": 1,
                            "workshopId": 1,
                            "fourWheeler": 1,
                        },
                    },



                ]) || [];




            if (shopData.length === 0) {
                return { success: false, message: "No shop data found for the given provider and service", shopDetail: [] };
            }


            return {
                success: true,
                shopDetail: shopData,
                service: serviceType,
            };

        } catch (error) {
            console.error("Error fetching shop profile with selected services:", error);
            return { success: false, message: "Internal server error", shopDetail: [] };
        }
    }

    async userUpdateData(data: { id: string; newData: string; whichToChange: string; }): Promise<{ success?: boolean; message?: string; newData?: string; }> {
        try {
            const update = await userModel.updateOne({ _id: new mongoose.Types.ObjectId(data.id) }, {
                $set: {
                    [data.whichToChange]: data.newData
                }
            })


            if (update.matchedCount === 0) {
                throw new CustomError("something Went Wrong Try Again", HttpStatus.NOT_FOUND)
            }
            if (update.modifiedCount === 0) {
                throw new CustomError("Updation Failed Try again", HttpStatus.FORBIDDEN)
            }
            return { success: true, newData: data.newData + "" }
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async addOrChangePhoto(data: { id: string; url?: string; }): Promise<{ success?: boolean; message?: string; url?: string }> {
        try {
            const updated = await userModel.updateOne({ _id: data.id }, {
                $set: {
                    logoUrl: data.url
                }
            })
            if (updated.matchedCount === 0) {
                throw new CustomError("User Not Found", HttpStatus.FORBIDDEN)
            }
            if (updated.modifiedCount === 0) {
                throw new CustomError("Something Went Wrong During Updating", HttpStatus.Unprocessable_Entity)
            }
            return { success: true, message: "ok", url: data.url }

        } catch (error: any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }

}

export default UserRepository;
