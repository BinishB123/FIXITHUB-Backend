"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otpSchema_1 = __importDefault(require("../../framework/mongoose/otpSchema"));
const userSchema_1 = __importDefault(require("../../framework/mongoose/userSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const serviceTypes_1 = __importDefault(require("../../framework/mongoose/serviceTypes"));
const brandSchema_1 = __importDefault(require("../../framework/mongoose/brandSchema"));
const providerSchema_1 = __importDefault(require("../../framework/mongoose/providerSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const providingServicesSchema_1 = __importDefault(require("../../framework/mongoose/providingServicesSchema"));
const statusCode_1 = __importDefault(require("../../entities/rules/statusCode"));
const errorInstance_1 = __importDefault(require("../../framework/services/errorInstance"));
const BookingDates_1 = __importDefault(require("../../framework/mongoose/BookingDates"));
const ServiceBookingModel_1 = __importDefault(require("../../framework/mongoose/ServiceBookingModel"));
const ChatSchema_1 = __importDefault(require("../../framework/mongoose/ChatSchema"));
const messageSchema_1 = __importDefault(require("../../framework/mongoose/messageSchema"));
const reviewSchema_1 = __importDefault(require("../../framework/mongoose/reviewSchema"));
const reportSchema_1 = __importDefault(require("../../framework/mongoose/reportSchema"));
class UserRepository {
    // this method is for saving the otp in dbs
    //temperory otp saving in dbs ttl
    async tempOTp(otp, email) {
        const newotp = await otpSchema_1.default.create({
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
    async userexist(email) {
        const userExist = await userSchema_1.default.findOne({ email: email.trim() });
        if (!userExist) {
            return false;
        }
        else {
            return true;
        }
    }
    async otpverification(email, otp) {
        const otpverifed = await otpSchema_1.default.findOne({ otp: otp, email: email });
        if (otpverifed !== null) {
            return true;
        }
        else {
            return false;
        }
    }
    // creating the user after otp verification
    async signup(userData) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(userData.password, saltRounds);
        const userCreated = await userSchema_1.default.create({
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
        }
        else {
            return { user: user, created: false };
        }
    }
    async signin(userData) {
        const findedUser = await userSchema_1.default.findOne({
            email: userData.email.trim(),
        });
        if (!findedUser) {
            return { success: false, message: "incorrect email" };
        }
        const passwordMatch = await bcrypt_1.default.compare(userData.password, findedUser.password);
        if (!passwordMatch) {
            return { success: false, message: "password is incorrect" };
        }
        if (findedUser.blocked) {
            return {
                success: false,
                message: "Access denied. Your account is blocked",
            };
        }
        const user = {
            id: findedUser._id.toString(),
            name: findedUser.name,
            email: findedUser.email,
            mobile: findedUser.mobile + "",
            logoUrl: findedUser.logoUrl,
            blocked: findedUser.blocked,
        };
        return { user: user, success: true };
    }
    async checker(id) {
        try {
            const checker = await userSchema_1.default.findOne({
                _id: new mongoose_1.default.Types.ObjectId(id),
            });
            if (!checker || checker.blocked) {
                throw new errorInstance_1.default("Permission Denied", statusCode_1.default.UNAUTHORIZED);
            }
            return { success: true };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode, error.reasons);
        }
    }
    async getServices(category) {
        try {
            const response = await serviceTypes_1.default.aggregate([
                { $match: { category: category } },
                { $project: { _id: 1, category: 1, serviceType: 1, imageUrl: 1 } },
            ]);
            return {
                success: response ? true : false,
                message: "success",
                services: response,
            };
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async getAllBrand() {
        try {
            const brand = await brandSchema_1.default.find().sort({ brand: 1 }).lean();
            const brands = brand.map((item) => {
                return { _id: item._id + "", brand: item.brand };
            });
            return { success: true, brandData: brands };
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async getAllShops(data) {
        try {
            const shops = await providerSchema_1.default.aggregate([
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
                        [`providing_service.${data.vehicleType}.typeId`]: new mongoose_1.default.Types.ObjectId(data.serviceId),
                        [`providing_service.${data.vehicleType}.subtype`]: { $ne: [] },
                        supportedBrands: {
                            $elemMatch: { brand: new mongoose_1.default.Types.ObjectId(data.brand) },
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
        }
        catch (error) {
            console.log(error);
            return { success: false, message: "500" };
        }
    }
    async getshopProfileWithSelectedServices(data) {
        try {
            const serviceType = (await serviceTypes_1.default.findOne({
                _id: new mongoose_1.default.Types.ObjectId(data.serviceId),
            })) || null;
            if (!serviceType) {
                return {
                    success: false,
                    message: "Service type not found",
                    shopDetail: [],
                };
            }
            const shopData = data.vehicleType === "twoWheeler"
                ? (await providingServicesSchema_1.default.aggregate([
                    {
                        $match: {
                            workshopId: new mongoose_1.default.Types.ObjectId(data.providerId),
                        },
                    },
                    {
                        $lookup: {
                            from: "providers",
                            localField: "workshopId",
                            foreignField: "_id",
                            as: "provider",
                        },
                    },
                    { $unwind: "$twoWheeler" },
                    {
                        $match: {
                            "twoWheeler.typeId": new mongoose_1.default.Types.ObjectId(data.serviceId),
                        },
                    },
                    { $unwind: "$provider" },
                    { $unwind: "$twoWheeler.subtype" },
                    {
                        $project: {
                            provider: {
                                workshopName: 1,
                                ownerName: 1,
                                email: 1,
                                mobile: 1,
                                logoUrl: 1,
                                about: 1,
                                workshopDetails: 1,
                            },
                            workshopId: 1,
                            twoWheeler: 1,
                        },
                    },
                ])) || []
                : (await providingServicesSchema_1.default.aggregate([
                    {
                        $match: {
                            workshopId: new mongoose_1.default.Types.ObjectId(data.providerId),
                        },
                    },
                    {
                        $lookup: {
                            from: "providers",
                            localField: "workshopId",
                            foreignField: "_id",
                            as: "provider",
                        },
                    },
                    { $unwind: "$fourWheeler" },
                    {
                        $match: {
                            "fourWheeler.typeId": new mongoose_1.default.Types.ObjectId(data.serviceId),
                        },
                    },
                    { $unwind: "$provider" },
                    { $unwind: "$fourWheeler.subtype" },
                    {
                        $project: {
                            provider: {
                                workshopName: 1,
                                ownerName: 1,
                                email: 1,
                                mobile: 1,
                                logoUrl: 1,
                                about: 1,
                                workshopDetails: 1,
                            },
                            workshopDetails: 1,
                            workshopId: 1,
                            fourWheeler: 1,
                        },
                    },
                ])) || [];
            if (shopData.length === 0) {
                return {
                    success: false,
                    message: "No shop data found for the given provider and service",
                    shopDetail: [],
                };
            }
            return {
                success: true,
                shopDetail: shopData,
                service: serviceType,
            };
        }
        catch (error) {
            console.error("Error fetching shop profile with selected services:", error);
            return {
                success: false,
                message: "Internal server error",
                shopDetail: [],
            };
        }
    }
    async userUpdateData(data) {
        try {
            const update = await userSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(data.id) }, {
                $set: {
                    [data.whichToChange]: data.newData,
                },
            });
            if (update.matchedCount === 0) {
                throw new errorInstance_1.default("something Went Wrong Try Again", statusCode_1.default.NOT_FOUND);
            }
            if (update.modifiedCount === 0) {
                throw new errorInstance_1.default("Updation Failed Try again", statusCode_1.default.FORBIDDEN);
            }
            return { success: true, newData: data.newData + "" };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async addOrChangePhoto(data) {
        try {
            const updated = await userSchema_1.default.updateOne({ _id: data.id }, {
                $set: {
                    logoUrl: data.url,
                },
            });
            if (updated.matchedCount === 0) {
                throw new errorInstance_1.default("User Not Found", statusCode_1.default.FORBIDDEN);
            }
            if (updated.modifiedCount === 0) {
                throw new errorInstance_1.default("Something Went Wrong During Updating", statusCode_1.default.Unprocessable_Entity);
            }
            return { success: true, message: "ok", url: data.url };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getBookingDates(id) {
        try {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            date.setHours(0, 0, 0, 0);
            const data = await BookingDates_1.default.aggregate([
                {
                    $match: {
                        providerid: new mongoose_1.default.Types.ObjectId(id),
                        date: { $gte: date },
                        count: { $gt: 0 },
                    },
                },
                { $sort: { date: 1 } },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        count: 1,
                    },
                },
            ]);
            if (date) {
                return { success: true, data: data };
            }
            throw new errorInstance_1.default("Something Went Wrong", statusCode_1.default.BAD_REQUEST);
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async SuccessBooking(data, payment_intentId) {
        try {
            const created = await ServiceBookingModel_1.default.create({
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
                advanceAmount: (data.selectedService.reduce((acc, cuu) => acc + cuu.price, 0) * 25) /
                    100,
                bookingfeeStatus: true,
                paymentIntentId: payment_intentId,
            });
            const update = await BookingDates_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(data.date), count: { $gt: 0 } }, { $inc: { count: -1 } });
            return { success: true };
        }
        catch (error) {
            throw new errorInstance_1.default("Internal Server Error", statusCode_1.default.INTERNAL_SERVER_ERROR);
        }
    }
    async getLatestBooking(userId) {
        try {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            const query = [
                { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
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
            const data = await ServiceBookingModel_1.default.aggregate(query);
            if (data.length === 0) {
                throw new errorInstance_1.default("No Bookings Registered", statusCode_1.default.NOT_FOUND);
            }
            return { success: true, data: data.length > 0 ? data : [] };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getServiceHistory(userID, startindex, endindex) {
        try {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            const query = [
                { $match: { userId: new mongoose_1.default.Types.ObjectId(userID) } },
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
                        "servicename._id": 1,
                        "user.mobile": 1,
                        "brand.brand": 1,
                        review: 1,
                        suggestions: 1,
                    },
                },
                { $skip: startindex },
                { $limit: 5 },
            ];
            const data = await ServiceBookingModel_1.default.aggregate(query);
            const count = await ServiceBookingModel_1.default.find({
                userId: new mongoose_1.default.Types.ObjectId(userID),
            });
            if (data.length === 0) {
                throw new errorInstance_1.default("No Bookings Registered", statusCode_1.default.NOT_FOUND);
            }
            return {
                success: true,
                data: data.length > 0 ? data : [],
                count: count.length,
            };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async afterFullpaymentDone(docId) {
        try {
            const updateOne = await ServiceBookingModel_1.default.updateOne({ _id: docId }, {
                $set: {
                    paymentStatus: "paid",
                },
            });
            return { success: true };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async cancelBooking(id, date) {
        try {
            const updateOne = await ServiceBookingModel_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(id) }, {
                $set: {
                    status: "cancelled",
                },
            });
            const updateDateCount = await BookingDates_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(date) }, {
                $inc: { count: 1 },
            });
            if (updateOne.modifiedCount === 0 &&
                updateDateCount.modifiedCount === 0) {
                throw new errorInstance_1.default("updation failed", statusCode_1.default.NO_CONTENT);
            }
            const data = await ServiceBookingModel_1.default.findOne({
                _id: new mongoose_1.default.Types.ObjectId(id),
            });
            return { success: true, payemntid: data?.paymentIntentId };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async notificationCountUpdater(id) {
        try {
            const message = await messageSchema_1.default.aggregate([
                { $match: { $and: [{ sender: "provider" }, { seen: false }] } },
                {
                    $lookup: {
                        from: "chats",
                        localField: "chatId",
                        foreignField: "_id",
                        as: "chat"
                    }
                },
                { $match: { "chat.userId": new mongoose_1.default.Types.ObjectId(id) } }
            ]);
            return { count: message.length };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async notificationsGetter(id) {
        try {
            const querynotifyData = [
                { $match: { userId: new mongoose_1.default.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "messages",
                        localField: "latestMessage",
                        foreignField: "_id",
                        as: "message",
                    },
                },
                { $unwind: "$message" },
                { $match: { "message.sender": "provider" } },
                {
                    $lookup: {
                        from: "providers",
                        localField: "providerId",
                        foreignField: "_id",
                        as: "provider",
                    },
                },
                { $unwind: "$provider" },
                {
                    $project: {
                        providerId: 1,
                        userId: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        latestMessage: 1,
                        message: 1,
                        "provider.workshopName": 1,
                        "provider.logoUrl": 1,
                    },
                },
            ];
            const querycountOfUnreadMessages = [
                {
                    $lookup: {
                        from: "chats",
                        localField: "chatId",
                        foreignField: "_id",
                        as: "chat",
                    },
                },
                { $unwind: "$chat" },
                {
                    $match: {
                        $and: [
                            { "chat.userId": new mongoose_1.default.Types.ObjectId(id) },
                            { sender: "provider" },
                            { seen: false },
                        ],
                    },
                },
                { $group: { _id: "$chatId", count: { $sum: 1 } } },
            ];
            const notifyData = await ChatSchema_1.default.aggregate(querynotifyData);
            const countOfUnreadMessages = await messageSchema_1.default.aggregate(querycountOfUnreadMessages);
            return {
                notfiyData: notifyData,
                countOfUnreadMessages: countOfUnreadMessages,
            };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async addReview(data, result) {
        try {
            const created = await reviewSchema_1.default.create({
                userId: data.userId,
                ProviderId: data.providerId,
                ServiceId: data.serviceId,
                bookingId: data.bookingId,
                opinion: data.review,
                images: result,
            });
            if (!created) {
                throw new errorInstance_1.default("something went wrong Can't post Your review");
            }
            await ServiceBookingModel_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(data.bookingId) }, {
                $set: {
                    review: created._id,
                },
            });
            const reviewResponse = {
                _id: created._id + "",
                userId: created.userId,
                ProviderId: created.ProviderId,
                ServiceId: created.ServiceId,
                bookingId: created.bookingId,
                opinion: created.opinion,
                reply: created.reply || null,
                like: created.like,
                images: created.images.map((image) => ({
                    url: image.url,
                })),
            };
            return { success: true, review: reviewResponse };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getReviewDetails(id) {
        try {
            const [review] = await reviewSchema_1.default.aggregate([
                { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "providers",
                        localField: "ProviderId",
                        foreignField: "_id",
                        as: "provider",
                    },
                },
                { $unwind: "$provider" },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        ServiceId: 1,
                        bookingId: 1,
                        opinion: 1,
                        reply: 1,
                        like: 1,
                        images: 1,
                        "provider._id": 1,
                        "provider.workshopName": 1,
                        "provider.logoUrl": 1,
                    },
                },
            ]);
            if (!review) {
                throw new errorInstance_1.default("Something went wrong Not Found", statusCode_1.default.NOT_FOUND);
            }
            return { ReviewData: review };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async deleteOneImage(id, url) {
        try {
            const update = await reviewSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(id) }, {
                $pull: {
                    images: { url: url },
                },
            });
            if (update.modifiedCount === 0) {
                throw new errorInstance_1.default("can't delete image ", statusCode_1.default.Unprocessable_Entity);
            }
            return { success: true };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async editReview(id, newReview) {
        try {
            const update = await reviewSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(id) }, {
                $set: {
                    opinion: newReview,
                },
            });
            if (update.modifiedCount === 0) {
                throw new errorInstance_1.default("Review editing Failed try again", statusCode_1.default.Unprocessable_Entity);
            }
            return { success: true };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async addOneImage(id, newImageUrl) {
        try {
            const update = await reviewSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(id) }, {
                $push: {
                    images: { url: newImageUrl },
                },
            });
            if (update.modifiedCount === 0) {
                throw new errorInstance_1.default("can't delete image ", statusCode_1.default.Unprocessable_Entity);
            }
            return { success: true, url: newImageUrl };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getFeedBacks(Id, limit) {
        try {
            const review = await reviewSchema_1.default.aggregate([
                { $match: { ServiceId: new mongoose_1.default.Types.ObjectId(Id) } },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                { $unwind: "$user" },
                { $skip: limit - 3 },
                { $limit: 3 },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        ServiceId: 1,
                        bookingId: 1,
                        opinion: 1,
                        reply: 1,
                        like: 1,
                        images: 1,
                        "user._id": 1,
                        "user.name": 1,
                        "user.logoUrl": 1,
                    },
                },
            ]);
            return { feedBacks: review ? review : [] };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async createReport(data) {
        console.log("data", data);
        try {
            const checker = await reportSchema_1.default.findOne({ BookingId: data.BookingId });
            if (checker) {
                throw new errorInstance_1.default("Already Reported", statusCode_1.default.CONFLICT);
            }
            const created = await reportSchema_1.default.create({
                userId: data.userId,
                providerId: data.providerId,
                BookingId: data.BookingId,
                report: data.report,
            });
            if (!created) {
                throw new errorInstance_1.default("Can't create something went wrong", statusCode_1.default.Unprocessable_Entity);
            }
            return { success: true };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getReport(id) {
        try {
            const data = (await reportSchema_1.default.aggregate([
                { $match: { userId: new mongoose_1.default.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "providers",
                        localField: "providerId",
                        foreignField: "_id",
                        as: "provider",
                    },
                },
                { $unwind: "$provider" },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        providerId: 1,
                        BookingId: 1,
                        report: 1,
                        "provider.workshopName": 1,
                        "provider.logoUrl": 1,
                        status: 1,
                    },
                },
            ]));
            return { data: data ? data : [] };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getBrands() {
        try {
            const brands = await brandSchema_1.default.aggregate([
                { $project: { _id: 0, brand: 1 } },
            ]);
            return { brands: brands };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
}
exports.default = UserRepository;
