import { IRequiredDataDForBooking, Provider, user, userResponseData, userSignIn } from "../../entities/rules/user";
import isUserRepository from "../../entities/irepositeries/iUserRepository";
import otpModel from "../../framework/mongoose/otpSchema";
import userModel from "../../framework/mongoose/userSchema";
import bcrypt from "bcrypt";
import ServiceTypeModel from "../../framework/mongoose/serviceTypes";
import {
    IgetservicesResponse,
    IRequirementToFetchShops,
    ResponsegetBookingGreaterThanTodaysDate,
} from "../../entities/user/IuserResponse";
import brandModel from "../../framework/mongoose/brandSchema";
import providerModel from "../../framework/mongoose/providerSchema";
import mongoose from "mongoose";
import providingServicesModel from "../../framework/mongoose/providingServicesSchema";
import HttpStatus from "../../entities/rules/statusCode";
import CustomError from "../../framework/services/errorInstance";
import BookingDateModel from "../../framework/mongoose/BookingDates";
import ServiceBookingModel from "../../framework/mongoose/ServiceBookingModel";
import { log } from "node:console";

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
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async getBookingDates(id: string): Promise<{ success?: boolean; data?: { _id: mongoose.ObjectId; date: Date; count: number; }[] | []; }> {
        try {

            const date = new Date()
            date.setDate(date.getDate() + 1)
            date.setHours(0, 0, 0, 0)
            const data = await BookingDateModel.aggregate([
                { $match: { providerid: new mongoose.Types.ObjectId(id), date: { $gte: date }, count: { $gt: 0 } } },
                { $sort: { date: 1 } },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        count: 1,
                    }
                }
            ])
            if (date) {
                return { success: true, data: data }
            }
            throw new CustomError("Something Went Wrong", HttpStatus.BAD_REQUEST)
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async SuccessBooking(data: IRequiredDataDForBooking, payment_intentId: string): Promise<{ success?: boolean; }> {
        try {

            const created = await ServiceBookingModel.create({
                providerId: data.providerId,
                userId: data.userId,
                date: data.date,
                amountPaid: 0,
                vechileType: data.vehicleType,
                serviceType: data.serviceType,
                selectedService: data.selectedService,
                suggestions: data.suggestions,
                status: "confirmed",
                vechileDetails: data.vehicleDetails,
                advanceAmount: (data.selectedService.reduce((acc, cuu) => acc + cuu.price, 0) * 25) / 100,
                bookingfeeStatus: true,
                paymentIntentId: payment_intentId

            })
            const update = await BookingDateModel.updateOne(
                { _id: new mongoose.Types.ObjectId(data.date), count: { $gt: 0 } },
                { $inc: { count: -1 } }
            );
            return { success: true }

        } catch (error) {

            throw new CustomError("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getLatestBooking(userId: string): Promise<{ success?: boolean; data?: ResponsegetBookingGreaterThanTodaysDate[]; }> {
        try {
            const date = new Date();
            date.setHours(0, 0, 0, 0);

            const query: any = [
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                {
                    $lookup: {
                        from: "bookingdates",
                        localField: "date",
                        foreignField: "_id",
                        as: "bookeddate",
                    },
                },
                { $unwind: "$bookeddate" },
                { $sort: { "bookeddate.date": -1 } },
                { $match: { "bookeddate.date": { $gt: date } } },
                {
                    $lookup: {
                        from: "providers",
                        localField: "providerId",
                        foreignField: "_id",
                        as: "provider",
                    },
                },
                {
                    $lookup: {
                        from: "servicetypes",
                        localField: "serviceType",
                        foreignField: "_id",
                        as: "servicename",
                    },
                },
                {
                    $lookup: {
                        from: "brands",
                        localField: "vechileDetails.brand",
                        foreignField: "_id",
                        as: "brand",
                    },
                },
                { $unwind: "$brand" },
                { $unwind: "$servicename" },
                { $unwind: "$provider" },
                {
                    $project: {
                        _id: 1,
                        vechileDetails: 1,
                        selectedService: 1,
                        advance: 1,
                        date: 1,
                        advanceAmount: 1,
                        status: 1,
                        vechileType: 1,
                        amountpaid: 1,
                        paymentStatus: 1,
                        "provider.workshopName": 1,
                        "provider.logoUrl": 1,
                        "bookeddate.date": 1,
                        "servicename.serviceType": 1,
                        "user.mobile": 1,
                        "brand.brand": 1,
                        suggestions: 1,
                    },
                },
            ];

            const data: ResponsegetBookingGreaterThanTodaysDate[] =
                await ServiceBookingModel.aggregate(query);

            if (data.length === 0) {
                throw new CustomError("No Bookings Registered", HttpStatus.NOT_FOUND);
            }
            return { success: true, data: data.length > 0 ? data : [] };

        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode)
        }
    }


    async getServiceHistory(userID: string, startindex: number, endindex: number): Promise<{ success?: boolean; data?: ResponsegetBookingGreaterThanTodaysDate[] | []; count:number }> {
        try {
            const date = new Date();
            date.setHours(0, 0, 0, 0);

            const query: any = [
                { $match: { userId: new mongoose.Types.ObjectId(userID) } },
                {
                    $lookup: {
                        from: "bookingdates",
                        localField: "date",
                        foreignField: "_id",
                        as: "bookeddate",
                    },
                },
                { $unwind: "$bookeddate" },
                { $sort: { "bookeddate.date": -1 } },
                { $match: { "bookeddate.date": { $lte: date } } },
                {
                    $lookup: {
                        from: "providers",
                        localField: "providerId",
                        foreignField: "_id",
                        as: "provider",
                    },
                },
                {
                    $lookup: {
                        from: "servicetypes",
                        localField: "serviceType",
                        foreignField: "_id",
                        as: "servicename",
                    },
                },
                {
                    $lookup: {
                        from: "brands",
                        localField: "vechileDetails.brand",
                        foreignField: "_id",
                        as: "brand",
                    },
                },
                { $unwind: "$brand" },
                { $unwind: "$servicename" },
                { $unwind: "$provider" },
                {
                    $project: {
                        _id: 1,
                        vechileDetails: 1,
                        selectedService: 1,
                        advance: 1,
                        advanceAmount: 1,
                        status: 1,
                        date: 1,
                        vechileType: 1,
                        amountpaid: 1,
                        paymentStatus: 1,
                        "provider._id": 1,
                        "provider.workshopName": 1,
                        "provider.logoUrl": 1,
                        "bookeddate.date": 1,
                        "servicename.serviceType": 1,
                        "user.mobile": 1,
                        "brand.brand": 1,
                        suggestions: 1,
                    },
                },
              {$skip:startindex},
              {$limit:5}
            ];

            const data: ResponsegetBookingGreaterThanTodaysDate[] =
                await ServiceBookingModel.aggregate(query);

            const count = await ServiceBookingModel.find({userId:new mongoose.Types.ObjectId(userID)})
            if (data.length === 0) {
                throw new CustomError("No Bookings Registered", HttpStatus.NOT_FOUND);
            }
            return { success: true, data: data.length > 0 ? data : [] ,count:count.length};

        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode)
        }
   }

    async afterFullpaymentDone(docId: string): Promise<{ success?: boolean; }> {
        try {
            const updateOne = await ServiceBookingModel.updateOne({ _id: docId }, {
                $set: {
                    paymentStatus: "paid"
                }
            })

            return { success: true }
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

    async cancelBooking(id: string, date: string): Promise<{ success?: boolean; payemntid?: string; }> {
        try {
            const updateOne = await ServiceBookingModel.updateOne({ _id: new mongoose.Types.ObjectId(id) }, {
                $set: {
                    status: "cancelled"
                }
            })
            const updateDateCount = await BookingDateModel.updateOne({ _id: new mongoose.Types.ObjectId(date) }, {
                $inc: { count: 1 }
            })
            if (updateOne.modifiedCount === 0 && updateDateCount.modifiedCount === 0) {
                throw new CustomError("updation failed", HttpStatus.NO_CONTENT)
            }
            const data = await ServiceBookingModel.findOne({ _id: new mongoose.Types.ObjectId(id) })
            return { success: true, payemntid: data?.paymentIntentId }
        } catch (error: any) {
            throw new CustomError(error.message, error.statusCode)
        }
    }

}

export default UserRepository;
