"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const providerSchema_1 = __importDefault(require("../../framework/mongoose/providerSchema"));
const otpSchema_1 = __importDefault(require("../../framework/mongoose/otpSchema"));
const serviceTypes_1 = __importDefault(require("../../framework/mongoose/serviceTypes"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const vehicleSchema_1 = __importDefault(require("../../framework/mongoose/vehicleSchema"));
const providingServicesSchema_1 = __importDefault(require("../../framework/mongoose/providingServicesSchema"));
const brandSchema_1 = __importDefault(require("../../framework/mongoose/brandSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorInstance_1 = __importDefault(require("../../framework/services/errorInstance"));
const statusCode_1 = __importDefault(require("../../entities/rules/statusCode"));
const BookingDates_1 = __importDefault(require("../../framework/mongoose/BookingDates"));
const ServiceBookingModel_1 = __importDefault(require("../../framework/mongoose/ServiceBookingModel"));
const ChatSchema_1 = __importDefault(require("../../framework/mongoose/ChatSchema"));
const messageSchema_1 = __importDefault(require("../../framework/mongoose/messageSchema"));
const reviewSchema_1 = __importDefault(require("../../framework/mongoose/reviewSchema"));
class ProviderRepository {
    async sendOtp(otp, email) {
        try {
            const newOtp = await otpSchema_1.default.create({
                userEmail: email,
                otp: otp,
            });
            if (newOtp) {
                return { created: true };
            }
            return { created: false };
        }
        catch (error) {
            return { created: false };
        }
    }
    async providerExist(email) {
        try {
            const exist = await providerSchema_1.default.findOne({ email: email });
            if (exist) {
                return true;
            }
            return false;
        }
        catch (error) {
            return true;
        }
    }
    async verifyOtp(email, otp) {
        try {
            const otpIsThereOrSame = await otpSchema_1.default.findOne({
                userEmail: email,
                otp: otp,
            });
            if (!otpIsThereOrSame) {
                return false;
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async registerProvider(registerdata) {
        try {
            const saltRounds = 10;
            const vehicleTypes = await vehicleSchema_1.default.find();
            const providingService = vehicleTypes.map((data) => {
                return { vehicleType: data._id + "", services: [] };
            });
            const hashedPassword = await bcrypt_1.default.hash(registerdata.password, saltRounds);
            const created = await providerSchema_1.default.create({
                workshopName: registerdata.workshopName,
                ownerName: registerdata.ownerName,
                email: registerdata.email,
                password: hashedPassword,
                mobile: registerdata.mobile,
                workshopDetails: {
                    address: registerdata.workshopDetails.address,
                    location: {
                        type: "Point",
                        coordinates: [
                            registerdata.workshopDetails.coordinates.long,
                            registerdata.workshopDetails.coordinates.lat,
                        ],
                    },
                },
                blocked: false,
                requestAccept: false,
            });
            if (!created) {
                return { created: false, message: "registration failed" };
            }
            const provider = {
                id: created._id + "",
                ownername: created.ownerName,
                workshopname: created.workshopName,
                email: created.email,
                mobile: created.mobile,
                requested: created.requestAccept,
                blocked: created.blocked,
            };
            return { created: true, message: "register", provider: provider };
        }
        catch (error) {
            return { created: false, message: "server down" };
        }
    }
    async signInProvider(providerSignData) {
        try {
            const providerExist = await providerSchema_1.default.findOne({
                email: providerSignData.email,
            });
            if (!providerExist) {
                return {
                    success: false,
                    message: "provider not exist with this email",
                };
            }
            const passwordMatch = await bcrypt_1.default.compare(providerSignData.password, providerExist.password);
            if (!passwordMatch) {
                return { success: false, message: "incorrect password" };
            }
            if (providerExist.requestAccept === false) {
                return { success: false, message: "registration request not accepted" };
            }
            if (providerExist.requestAccept === null) {
                return { success: false, message: "rejected your request" };
            }
            if (providerExist.blocked === true) {
                return {
                    success: false,
                    message: "Access denied. Your account has been blocked. ",
                };
            }
            const provider = {
                id: providerExist._id + "",
                ownername: providerExist.ownerName,
                workshopname: providerExist.workshopName,
                email: providerExist.email,
                mobile: providerExist.mobile,
                requested: providerExist.requestAccept,
                blocked: providerExist.blocked,
                logoUrl: providerExist.logoUrl ? providerExist.logoUrl : null,
            };
            return { success: true, message: "provider exist", provider: provider };
        }
        catch (error) {
            return { success: false, message: "server down" };
        }
    }
    async getProviderServices(id, vehicleType) {
        try {
            const allService = await serviceTypes_1.default.find().lean();
            const [providerData] = await providingServicesSchema_1.default.find({ workshopId: id });
            const service = allService.map((service) => ({
                ...service,
                _id: service._id.toString(),
            }));
            return {
                success: true,
                message: "200",
                providerService: providerData,
                allServices: service,
            };
        }
        catch (error) {
            console.log(error.message);
            return { success: false, message: "500" };
        }
    }
    async addGeneralOrRoadService(data) {
        try {
            //  service data based on the category (general or road)
            const serviceData = {
                typeId: data.typeid,
                category: data.category,
                subtype: [],
            };
            // Check the vehicle type
            const vehicle = await vehicleSchema_1.default.findOne({
                _id: data.vehicleType,
            });
            if (vehicle?.vehicleType === 2) {
                // Two-wheeler
                const provider = await providingServicesSchema_1.default.findOne({
                    workshopId: new mongoose_1.default.Types.ObjectId(data.providerid),
                    "twoWheeler.typeId": new mongoose_1.default.Types.ObjectId(data.typeid),
                });
                if (provider) {
                    const updatedProvider = await providingServicesSchema_1.default.findOneAndUpdate({
                        workshopId: new mongoose_1.default.Types.ObjectId(data.providerid),
                        "twoWheeler.typeId": new mongoose_1.default.Types.ObjectId(data.typeid),
                    }, {
                        $push: { twoWheeler: serviceData },
                    }, { new: true });
                    return {
                        success: true,
                        message: "Two-wheeler service updated successfully",
                    };
                }
                else {
                    const createdProvider = await providingServicesSchema_1.default.findOneAndUpdate({ workshopId: new mongoose_1.default.Types.ObjectId(data.providerid) }, {
                        $push: {
                            twoWheeler: serviceData,
                        },
                    }, { new: true, upsert: true });
                    return {
                        success: true,
                        message: "New two-wheeler service created successfully",
                    };
                }
            }
            else {
                const provider = await providingServicesSchema_1.default.findOne({
                    workshopId: new mongoose_1.default.Types.ObjectId(data.providerid),
                    "fourWheeler.typeId": new mongoose_1.default.Types.ObjectId(data.typeid),
                });
                if (provider) {
                    const updatedProvider = await providingServicesSchema_1.default.findOneAndUpdate({
                        workshopId: new mongoose_1.default.Types.ObjectId(data.providerid),
                        "fourWheeler.typeId": new mongoose_1.default.Types.ObjectId(data.typeid),
                    }, {
                        $push: { twoWheeler: serviceData },
                    }, { new: true });
                    return {
                        success: true,
                        message: "Four-wheeler service updated successfully",
                    };
                }
                else {
                    const createdProvider = await providingServicesSchema_1.default.findOneAndUpdate({ workshopId: new mongoose_1.default.Types.ObjectId(data.providerid) }, {
                        $push: {
                            fourWheeler: serviceData,
                        },
                    }, { new: true, upsert: true });
                    return {
                        success: true,
                        message: "New four-wheeler service created successfully",
                    };
                }
            }
        }
        catch (error) {
            console.error(error);
            return {
                success: false,
                message: "Error occurred while adding or updating service",
            };
        }
    }
    async removeGeneralOrRoadService(data) {
        try {
            const updateOne = await providingServicesSchema_1.default.updateOne({ workshopId: data.workshopId }, {
                $pull: {
                    [data.vehicleType]: {
                        typeId: new mongoose_1.default.Types.ObjectId(data.typeid),
                    },
                },
            });
            console.log("Update Result:", updateOne);
            if (updateOne.modifiedCount === 0) {
                throw new errorInstance_1.default("Cannot remove item: No match found or nothing changed.", statusCode_1.default.Unprocessable_Entity);
            }
            return { success: true };
        }
        catch (error) {
            console.error("Error during updateOne operation:", error);
            throw error; // Re-throw to propagate error handling
        }
    }
    async addSubTypes(providerid, serviceid, newSubType) {
        try {
            const newData = {
                type: newSubType.type,
                startingPrice: newSubType.startingprice,
            };
            if (parseInt(newSubType.vehicleType) === 2) {
                // For two-wheelers
                const update = await providingServicesSchema_1.default.findOneAndUpdate({ workshopId: providerid, "twoWheeler.typeId": serviceid }, { $push: { "twoWheeler.$.subtype": newData } }, { new: true });
                if (update) {
                    console.log("Updated two-wheeler service:", update);
                    return {
                        success: true,
                        message: "Subtype added to two-wheeler successfully",
                    };
                }
            }
            else {
                // For four-wheelers
                const update = await providingServicesSchema_1.default.findOneAndUpdate({ workshopId: providerid, "fourWheeler.typeId": serviceid }, { $push: { "fourWheeler.$.subtype": newData } }, { new: true });
                if (update) {
                    console.log("Updated four-wheeler service:", update);
                    return {
                        success: true,
                        message: "Subtype added to four-wheeler successfully",
                    };
                }
            }
            return { success: false, message: "Failed to update service" };
        }
        catch (error) {
            console.error("Error while adding subtype:", error.message);
            return { success: false, message: "Error occurred while adding subtype" };
        }
    }
    async editSubType(providerid, serviceid, subtype) {
        try {
            const updated = parseInt(subtype.vehicleType) === 4
                ? await providingServicesSchema_1.default.updateOne({
                    workshopId: providerid,
                    "fourWheeler.typeId": serviceid,
                    "fourWheeler.subtype.type": subtype.type, // Matching subtype based on type
                }, {
                    $set: {
                        "fourWheeler.$[w].subtype.$[s].startingPrice": subtype.startingprice,
                    },
                }, {
                    arrayFilters: [
                        { "w.typeId": serviceid },
                        { "s.type": subtype.type },
                    ],
                })
                : await providingServicesSchema_1.default.updateOne({
                    workshopId: providerid,
                    "twoWheeler.typeId": serviceid,
                    "twoWheeler.subtype.type": subtype.type,
                }, {
                    $set: {
                        "twoWheeler.$[w].subtype.$[s].startingPrice": subtype.startingprice,
                    },
                }, {
                    arrayFilters: [
                        { "w.typeId": serviceid },
                        { "s.type": subtype.type },
                    ],
                });
            if (updated.modifiedCount > 0) {
                return { success: true, message: "Subtype updated successfully" };
            }
            else {
                return {
                    success: false,
                    message: "Subtype not found or no changes made",
                };
            }
        }
        catch (error) {
            console.error("Error while updating subtype:", error.message);
            return {
                success: false,
                message: "Error occurred while updating subtype",
            };
        }
    }
    async deleteSubtype(providerid, serviceid, subtype, vehicleType) {
        try {
            const deleted = parseInt(vehicleType) === 2
                ? await providingServicesSchema_1.default.updateOne({ workshopId: providerid, "twoWheeler.typeId": serviceid }, {
                    $pull: {
                        "twoWheeler.$.subtype": { type: subtype.type },
                    },
                })
                : await providingServicesSchema_1.default.updateOne({ workshopId: providerid, "fourWheeler.typeId": serviceid }, {
                    $pull: {
                        "fourWheeler.$.subtype": { type: subtype.type },
                    },
                });
            if (deleted.modifiedCount > 0) {
                return { success: true, message: "Subtype deleted successfully." };
            }
            else {
                return {
                    success: false,
                    message: "Subtype not found or already deleted.",
                };
            }
        }
        catch (error) {
            console.error("Error deleting subtype:", error.message);
            return {
                success: false,
                message: "An error occurred while deleting the subtype.",
            };
        }
    }
    async getallBrands(id) {
        try {
            const data = await brandSchema_1.default.find().lean();
            const [providerData] = await providerSchema_1.default.aggregate([
                { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
                { $project: { _id: 0, supportedBrands: 1 } },
            ]);
            const formattedBrands = data.map((brand) => ({
                _id: brand._id.toString(),
                brand: brand.brand,
            }));
            return {
                succes: true,
                message: "200",
                brands: formattedBrands,
                supportedBrands: providerData.supportedBrands.length > 0
                    ? providerData.supportedBrands
                    : [],
            };
        }
        catch (error) {
            return { succes: false, message: "500" };
        }
    }
    async addBrands(data) {
        try {
            const updated = await providerSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(data.id) }, {
                $push: {
                    supportedBrands: { brand: data.brandid },
                },
            });
            if (updated.modifiedCount === 1) {
                return { success: true, message: "Brand Added successfully " };
            }
            else {
                return { success: false, message: "Brand not found or not removed" };
            }
        }
        catch (error) {
            console.log(error.message);
            return { success: false, message: "500" };
        }
    }
    async deleteBrand(data) {
        try {
            const updated = await providerSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(data.id) }, {
                $pull: {
                    supportedBrands: { brand: data.brandid },
                },
            });
            if (updated.modifiedCount === 1) {
                return { success: true, message: "Brand Removed successfully " };
            }
            else {
                return { success: false, message: "Brand not found or not removed" };
            }
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async getDataToProfile(id) {
        try {
            const aggregateResult = await providerSchema_1.default.aggregate([
                {
                    $match: { _id: new mongoose_1.default.Types.ObjectId(id) },
                },
                {
                    $project: {
                        _id: 1,
                        workshopName: 1,
                        ownerName: 1,
                        email: 1,
                        workshopDetails: 1,
                        blocked: 1,
                        requestAccept: 1,
                        supportedBrands: 1,
                        logoUrl: 1,
                        about: 1,
                        mobile: 1,
                    },
                },
            ]);
            const getData = aggregateResult[0];
            if (!getData) {
                return { success: false, message: "404", providerData: getData };
            }
            return { success: true, message: "200", providerData: getData };
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async editabout(data) {
        console.log(data.id);
        try {
            const update = await providerSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(data.id) }, {
                $set: {
                    about: data.about,
                },
            });
            const d = await providerSchema_1.default.findOne({ _id: data.id });
            if (update.modifiedCount === 1) {
                return { success: true, message: "updated" };
            }
            return { success: false, message: "422" };
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async addImage(data) {
        try {
            const updated = await providerSchema_1.default.updateOne({ _id: data.id }, {
                $set: {
                    logoUrl: data.url,
                },
            });
            if (updated.modifiedCount === 1) {
                return { success: true, message: "updated", url: data.url };
            }
            return { success: false, message: "422" };
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async updateProfiledatas(data) {
        try {
            const updated = await providerSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(data.id) }, {
                $set: {
                    [data.whichisTotChange]: data.newOne,
                },
            });
            if (updated.matchedCount === 0) {
                return { success: false };
            }
            return updated.modifiedCount === 1
                ? { success: true, message: "Document updated successfully" }
                : { success: false, message: "No changes were made" };
        }
        catch (error) {
            console.error("Error updating document:", error);
            return { success: false, message: "500" };
        }
    }
    async getAllBrand(id) {
        try {
            const brandData = await providerSchema_1.default.aggregate([
                { $unwind: "$supportedBrands" },
                {
                    $lookup: {
                        from: "brands",
                        localField: "supportedBrands.brand",
                        foreignField: "_id",
                        as: "providerbrands",
                    },
                },
                { $unwind: "$providerbrands" },
                { $project: { _id: 0, providerbrands: 1 } },
            ]);
            if (brandData) {
                return { success: true, message: "200", brandData: brandData };
            }
            return { success: false, message: "" };
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async changepassword(data) {
        try {
            const provider = await providerSchema_1.default.findOne({
                _id: new mongoose_1.default.Types.ObjectId(data.id),
            });
            if (provider) {
                const passwordMatch = await bcrypt_1.default.compare(data.currentpassowrd, provider.password);
                if (!passwordMatch) {
                    throw new errorInstance_1.default("Incorrect Password", statusCode_1.default.UNAUTHORIZED);
                }
                const saltRounds = 10;
                const hashedPassword = await bcrypt_1.default.hash(data.newpassowrd, saltRounds);
                const updated = await providerSchema_1.default.updateOne({ _id: data.id }, {
                    $set: {
                        password: hashedPassword,
                    },
                });
                if (updated.modifiedCount === 1) {
                    return { success: true, message: "updated" };
                }
                throw new errorInstance_1.default("New password must be different from the old password.", statusCode_1.default.CONFLICT);
            }
            throw new errorInstance_1.default("User Not Found", statusCode_1.default.NOT_FOUND);
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode, error.reasons);
        }
    }
    async updateLogo(url, id) {
        try {
            const updated = await providerSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(id) }, {
                $set: {
                    logoUrl: url,
                },
            });
            if (updated.modifiedCount === 0) {
                throw new errorInstance_1.default("Something Went Wrong While Updating", statusCode_1.default.FORBIDDEN);
            }
            return { success: true, url: url };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.status);
        }
    }
    async addDate(date, id) {
        try {
            const created = await BookingDates_1.default.create({
                providerid: id,
                date: date,
            });
            if (created) {
                return { success: true, id: created._id + "" };
            }
            throw new errorInstance_1.default("Date Adding Failed", statusCode_1.default.BAD_REQUEST);
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async providerAddedDates(id) {
        try {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() + 1);
            const data = await BookingDates_1.default.aggregate([
                {
                    $match: {
                        providerid: new mongoose_1.default.Types.ObjectId(id),
                        date: { $gte: date },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        count: 1,
                        bookedCount: 1,
                    },
                },
                { $sort: { date: 1 } },
            ]);
            return { success: true, data: !data ? [] : data };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async updateCount(id, toDo) {
        try {
            console.log("id", id, "tofo,", toDo);
            const update = toDo === "add"
                ? await BookingDates_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(id) }, {
                    $inc: {
                        count: 1,
                    },
                })
                : await BookingDates_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(id), count: { $gt: 0 } }, {
                    $inc: {
                        count: -1,
                    },
                });
            if (update.modifiedCount === 1) {
                return { success: true };
            }
            throw new errorInstance_1.default("Can't Update Something went wrong", statusCode_1.default.BAD_REQUEST);
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getBookingsAccordingToDates(id, date) {
        try {
            const data = await ServiceBookingModel_1.default.aggregate([
                { $match: { providerId: new mongoose_1.default.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "bookingdates",
                        localField: "date",
                        foreignField: "_id",
                        as: "bookeddate",
                    },
                },
                { $unwind: "$bookeddate" },
                { $match: { "bookeddate.date": new Date(date) } },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
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
                { $unwind: "$servicename" },
                { $unwind: "$user" },
                {
                    $project: {
                        _id: 1,
                        vechileDetails: 1,
                        selectedService: 1,
                        advanceAmount: 1,
                        advance: 1,
                        status: 1,
                        amountpaid: 1,
                        paymentStatus: 1,
                        "user._id": 1,
                        "user.name": 1,
                        "bookeddate.date": 1,
                        "servicename.serviceType": 1,
                        "user.mobile": 1,
                    },
                },
            ]);
            if (data.length === 0) {
                throw new errorInstance_1.default("No Booking Registerd On this Date", statusCode_1.default.NOT_FOUND);
            }
            return { success: true, data: data.length > 0 ? data : [] };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getBookingStillTodaysDate(id, startIndex, status) {
        try {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            const query = [
                { $match: { providerId: new mongoose_1.default.Types.ObjectId(id) } },
                ...(status ? [{ $match: { status: status } }] : []),
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
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
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
                { $unwind: "$user" },
                {
                    $project: {
                        _id: 1,
                        vechileDetails: 1,
                        selectedService: 1,
                        advanceAmount: 1,
                        advance: 1,
                        status: 1,
                        amountpaid: 1,
                        paymentStatus: 1,
                        "user._id": 1,
                        "user.name": 1,
                        "user.logoUrl": 1,
                        "bookeddate.date": 1,
                        "servicename.serviceType": 1,
                        "user.mobile": 1,
                        "brand.brand": 1,
                        suggestions: 1,
                    },
                },
                { $skip: startIndex },
                { $limit: 10 },
            ];
            const data = await ServiceBookingModel_1.default.aggregate(query);
            const count = await ServiceBookingModel_1.default.find({
                providerId: new mongoose_1.default.Types.ObjectId(id),
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
    async getBookingGreaterThanTodaysDate(id) {
        try {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            const query = [
                { $match: { providerId: new mongoose_1.default.Types.ObjectId(id) } },
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
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
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
                { $unwind: "$user" },
                {
                    $project: {
                        _id: 1,
                        vechileDetails: 1,
                        selectedService: 1,
                        advanceAmount: 1,
                        advance: 1,
                        status: 1,
                        amountpaid: 1,
                        paymentStatus: 1,
                        "user._id": 1,
                        "user.name": 1,
                        "user.logoUrl": 1,
                        "bookeddate.date": 1,
                        "servicename.serviceType": 1,
                        "user.mobile": 1,
                        "brand.brand": 1,
                        suggestions: 1,
                    },
                },
            ];
            const data = await ServiceBookingModel_1.default.aggregate(query);
            // if (data.length === 0) {
            //   throw new CustomError("No Bookings Registered", HttpStatus.NOT_FOUND);
            // }
            return { success: true, data: data.length > 0 ? data : [] };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async updateStatus(id, status, amount) {
        try {
            const update = await ServiceBookingModel_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(id) }, {
                $set: {
                    status: status === "outfordelivery" && amount <= 1000
                        ? "completed"
                        : status,
                },
            });
            if (update.modifiedCount === 0) {
                throw new errorInstance_1.default("Updation Failed Something Went Wrong", statusCode_1.default.FORBIDDEN);
            }
            const detail = await ServiceBookingModel_1.default.findOne({
                _id: new mongoose_1.default.Types.ObjectId(id),
            });
            return status !== "outfordelivery"
                ? { success: true }
                : { success: true, paymentId: detail?.paymentIntentId };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async notificationCountUpdater(id) {
        try {
            const message = await messageSchema_1.default.aggregate([
                { $match: { $and: [{ sender: "user" }, { seen: false }] } },
                { $lookup: {
                        from: "chats",
                        localField: "chatId",
                        foreignField: "_id",
                        as: "chat"
                    }
                },
                { $match: { "chat.providerId": new mongoose_1.default.Types.ObjectId(id) } }
            ]);
            console.log(message.length);
            return { count: message.length };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async notificationsGetter(id) {
        try {
            const querynotifyData = [
                { $match: { providerId: new mongoose_1.default.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "messages",
                        localField: "latestMessage",
                        foreignField: "_id",
                        as: "message",
                    },
                },
                { $unwind: "$message" },
                { $match: { "message.sender": "user" } },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                { $unwind: "$user" },
                {
                    $project: {
                        providerId: 1,
                        userId: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        latestMessage: 1,
                        message: 1,
                        "user.name": 1,
                        "user.logoUrl": 1,
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
                            { "chat.providerId": new mongoose_1.default.Types.ObjectId(id) },
                            { sender: "user" },
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
    async getFeedBacks(providerId) {
        try {
            const review = await reviewSchema_1.default.aggregate([
                { $match: { ProviderId: new mongoose_1.default.Types.ObjectId(providerId) } },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                { $unwind: "$user" },
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
    async likeFeedBack(id, state) {
        try {
            const update = await reviewSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(id) }, {
                $set: {
                    like: state,
                },
            });
            if (update.modifiedCount === 0) {
                throw new errorInstance_1.default("Updation Failed", statusCode_1.default.Unprocessable_Entity);
            }
            return { success: true };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async reply(id, reply) {
        try {
            const update = await reviewSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(id) }, {
                $set: {
                    reply: reply,
                },
            });
            if (update.modifiedCount === 0) {
                throw new errorInstance_1.default("Updation Failed", statusCode_1.default.Unprocessable_Entity);
            }
            return { success: true };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getMonthlyRevenue(id) {
        try {
            const currentYear = new Date().getFullYear();
            const data = await ServiceBookingModel_1.default.aggregate([
                {
                    $lookup: {
                        from: "bookingdates",
                        localField: "date",
                        foreignField: "_id",
                        as: "bookeddate",
                    },
                },
                { $unwind: "$bookeddate" },
                {
                    $match: {
                        providerId: new mongoose_1.default.Types.ObjectId(id),
                        paymentStatus: "paid",
                        "bookeddate.date": {
                            $gte: new Date(`${currentYear}-01-01`),
                            $lt: new Date(`${currentYear + 1}-01-01`),
                        },
                    },
                },
                { $unwind: "$selectedService" },
                {
                    $group: {
                        _id: { $month: "$date" },
                        revenue: { $sum: "$selectedService.price" },
                    },
                },
                {
                    $project: {
                        month: "$_id",
                        revenue: 1,
                        _id: 0,
                    },
                },
                { $sort: { month: 1 } },
            ]);
            return { data: data };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async TopServicesBooked(id) {
        try {
            const data = await ServiceBookingModel_1.default.aggregate([
                { $match: { providerId: new mongoose_1.default.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "servicetypes",
                        localField: "serviceType",
                        foreignField: "_id",
                        as: "serviceDetails",
                    },
                },
                { $unwind: "$serviceDetails" },
                {
                    $group: {
                        _id: "$serviceDetails.serviceType",
                        count: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        serviceType: "$_id",
                        count: 1,
                        _id: 0,
                    },
                },
                { $sort: { count: -1 } },
            ]);
            console.log("data", data);
            return { data: data };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getSalesReport(id, year, month) {
        try {
            const data = await ServiceBookingModel_1.default.aggregate([
                {
                    $match: {
                        $and: [
                            { providerId: new mongoose_1.default.Types.ObjectId(id) },
                            { status: "completed" },
                            { paymentStatus: "paid" },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: "bookingdates",
                        localField: "date",
                        foreignField: "_id",
                        as: "selectedDate",
                    },
                },
                { $unwind: "$selectedDate" },
                {
                    $match: {
                        "selectedDate.date": {
                            $gte: new Date(year, month, 1),
                            $lt: new Date(year, month + 1, 1),
                        },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                { $unwind: "$user" },
                {
                    $lookup: {
                        from: "servicetypes",
                        localField: "serviceType",
                        foreignField: "_id",
                        as: "service",
                    },
                },
                { $unwind: "$service" },
                {
                    $addFields: {
                        totalPrice: {
                            $reduce: {
                                input: "$selectedService",
                                initialValue: 0,
                                in: { $add: ["$$value", "$$this.price"] },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        "service.serviceType": 1,
                        "user.name": 1,
                        "selectedDate.date": 1,
                        selectedService: 1,
                        totalPrice: 1
                    },
                },
            ]);
            return { report: data };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
}
exports.default = ProviderRepository;
