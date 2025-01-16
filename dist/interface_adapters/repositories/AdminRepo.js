"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminSchema_1 = __importDefault(require("../../framework/mongoose/adminSchema"));
const userSchema_1 = __importDefault(require("../../framework/mongoose/userSchema"));
const userSchema_2 = __importDefault(require("../../framework/mongoose/userSchema"));
const providerSchema_1 = __importDefault(require("../../framework/mongoose/providerSchema"));
const vehicleSchema_1 = __importDefault(require("../../framework/mongoose/vehicleSchema"));
const brandSchema_1 = __importDefault(require("../../framework/mongoose/brandSchema"));
const serviceTypes_1 = __importDefault(require("../../framework/mongoose/serviceTypes"));
const providingServicesSchema_1 = __importDefault(require("../../framework/mongoose/providingServicesSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorInstance_1 = __importDefault(require("../../framework/services/errorInstance"));
const statusCode_1 = __importDefault(require("../../entities/rules/statusCode"));
const ServiceBookingModel_1 = __importDefault(require("../../framework/mongoose/ServiceBookingModel"));
const reportSchema_1 = __importDefault(require("../../framework/mongoose/reportSchema"));
class AdminRepository {
    async adminSignIn(email, password) {
        try {
            const admin = await adminSchema_1.default.findOne({ email: email });
            if (admin && admin.password === password) {
                return {
                    success: true,
                    admin: { id: admin._id + "", email: admin.email },
                };
            }
            else {
                return { success: false, message: "invalid password or emailId" };
            }
        }
        catch (error) {
            return { success: false, message: "something went wrong" };
        }
    }
    async adminGetUserData() {
        try {
            const usersData = await userSchema_1.default.find({}).sort({ _id: -1 });
            if (!usersData) {
                return { success: true, users: [] };
            }
            const [{ active, blocked }] = await userSchema_2.default.aggregate([
                {
                    $group: {
                        _id: null,
                        // if true 1 else 0
                        active: { $sum: { $cond: [{ $eq: ["$blocked", false] }, 1, 0] } },
                        blocked: { $sum: { $cond: [{ $eq: ["$blocked", true] }, 1, 0] } },
                    },
                },
            ]);
            const formattedUsers = usersData.map((user) => ({
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                blocked: user.blocked,
            }));
            return {
                success: true,
                users: formattedUsers,
                active: active,
                blocked: blocked,
            };
        }
        catch (error) {
            return { success: false };
        }
    }
    async adminBlockUnBlockUser(id, state) {
        try {
            const updated = await userSchema_2.default.findByIdAndUpdate(id, {
                $set: { blocked: state },
            });
            return { success: true };
        }
        catch (error) {
            return { success: false };
        }
    }
    async getPendingProviders() {
        try {
            const providers = await providerSchema_1.default.aggregate([
                {
                    $match: {
                        requestAccept: false,
                    },
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
                        email: 1,
                    },
                },
            ]);
            return { success: true, providers: providers };
        }
        catch (error) {
            return { success: false, message: "something went wrong" };
        }
    }
    async getProviders() {
        try {
            const providers = await providerSchema_1.default.aggregate([
                {
                    $match: {
                        requestAccept: true,
                    },
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
                        email: 1,
                    },
                },
            ]);
            return { success: true, providers: providers };
        }
        catch (error) {
            return { success: false, message: "something went wrong" };
        }
    }
    async adminRequestAcceptAndReject(id, state) {
        try {
            const updated = await providerSchema_1.default.findByIdAndUpdate(id, {
                $set: { requestAccept: state },
            });
            if (state && updated) {
                const created = await providingServicesSchema_1.default.create({
                    workshopId: id,
                });
            }
            if (updated) {
                return { success: true };
            }
            return { success: false };
        }
        catch (error) {
            return { success: false };
        }
    }
    async providerBlockOrUnblock(id, state) {
        try {
            const updated = await providerSchema_1.default.findByIdAndUpdate(id, {
                $set: { blocked: state },
            });
            if (updated) {
                return { success: true };
            }
            return { success: false };
        }
        catch (error) {
            return { success: false };
        }
    }
    async vehicleTypealreadyExistOrNot(type) {
        try {
            const exist = await vehicleSchema_1.default.findOne({ vehicleType: type });
            if (exist) {
                return { success: false };
            }
            return { success: true };
        }
        catch (error) {
            return { success: false };
        }
    }
    async adminSettingsAddvehicleType(type) {
        try {
            const vehicleCreated = await vehicleSchema_1.default.create({ vehicleType: type });
            if (vehicleCreated) {
                return { success: true };
            }
            return { success: false };
        }
        catch (error) {
            return { success: false };
        }
    }
    async brandExistOrNot(brand) {
        try {
            const exist = await brandSchema_1.default.findOne({ brand: brand });
            if (exist) {
                return { success: false };
            }
            return { success: true };
        }
        catch (error) {
            return { success: false };
        }
    }
    async adminSettingAddBrand(brand) {
        try {
            const created = await brandSchema_1.default.create({ brand: brand.trim() });
            if (created) {
                return { success: true };
            }
            return { success: false };
        }
        catch (error) {
            return { success: false };
        }
    }
    async settingsDatas() {
        try {
            const brands = await brandSchema_1.default.aggregate([
                { $project: { _id: 0, brand: 1 } },
            ]);
            const generalServices = await serviceTypes_1.default.aggregate([
                { $match: { category: "general" } },
                {
                    $project: {
                        _id: 1,
                        serviceType: 1,
                        imageUrl: 1,
                        category: 1,
                        subTypes: 1,
                    },
                },
            ]);
            const roadAssistance = await serviceTypes_1.default.aggregate([
                { $match: { category: "road" } },
                { $project: { _id: 1, serviceType: 1, imageUrl: 1, category: 1 } },
            ]);
            return {
                success: true,
                brands: brands.length > 0 ? brands : [],
                generalServices: generalServices.length > 0 ? generalServices : [],
                roadAssistance: roadAssistance.length > 0 ? roadAssistance : [],
            };
        }
        catch (error) {
            return { success: false };
        }
    }
    async checkserviceAllreadyExistOrNot(serviceName) {
        try {
            const exist = await serviceTypes_1.default.findOne({
                serviceType: serviceName.trim(),
            });
            if (exist) {
                return { success: true, message: "Service already Exist" };
            }
            return { success: false };
        }
        catch (error) {
            return { success: true, message: "something went wrong" };
        }
    }
    async addGeneralserviceOrRoadAssistance(data) {
        try {
            if (data.category === "general") {
                const created = await serviceTypes_1.default.create({
                    category: data.category,
                    serviceType: data.servicetype,
                    imageUrl: data.imageUrl,
                    subTypes: [],
                });
                const filteredData = {
                    category: created.category,
                    serviceType: created.serviceType,
                    imageUrl: created.imageUrl,
                    subTypes: created.subTypes,
                    _id: created._id,
                };
                if (created) {
                    return { success: true, message: "Created", created: filteredData };
                }
                else {
                    return {
                        success: false,
                        message: "Failed to create general service type.",
                    };
                }
            }
            else if (data.category === "road") {
                const created = await serviceTypes_1.default.create({
                    category: data.category,
                    serviceType: data.servicetype,
                    imageUrl: data.imageUrl,
                });
                const filteredData = {
                    category: created.category,
                    serviceType: created.serviceType,
                    imageUrl: created.imageUrl,
                    _id: created._id,
                };
                if (created) {
                    return { success: true, message: "Created", created: filteredData };
                }
                else {
                    return {
                        success: false,
                        message: "Failed to create road service type.",
                    };
                }
            }
            return { success: false, message: "" };
        }
        catch (error) {
            return { success: false, message: "" };
        }
    }
    async addOrUpdateSubType(data) {
        try {
            const existingDocument = await serviceTypes_1.default.findOne({
                _id: data.id,
                "subTypes.type": data.type.trim(),
            });
            let updated;
            if (existingDocument) {
                updated = await serviceTypes_1.default.findOneAndUpdate({ _id: data.id, "subTypes.type": data.type.trim() }, { $set: { "subTypes.$.type": data.type.trim() } }, { new: true });
            }
            else {
                updated = await serviceTypes_1.default.findOneAndUpdate({ _id: data.id }, { $push: { subTypes: { type: data.type.trim() } } }, { new: true });
            }
            if (!updated) {
                return { success: false, message: "Cannot update or add subType" };
            }
            const newSubtypeId = updated.subTypes[updated.subTypes.length - 1];
            return { success: true, updatedData: newSubtypeId };
        }
        catch (error) {
            console.log(error);
            return { success: false, message: "500" };
        }
    }
    async deleteSubType(data) {
        try {
            const deleted = await serviceTypes_1.default.updateOne({ _id: data.id }, { $pull: { subTypes: { _id: data.type } } });
            if (deleted.modifiedCount === 0) {
                return { success: false, message: "409" };
            }
            return { success: true, message: "deleted" };
        }
        catch (error) {
            return { success: false, message: "500" };
        }
    }
    async editServiceName(data) {
        try {
            const updated = await serviceTypes_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(data.id) }, {
                $set: { serviceType: data.newName },
            });
            if (updated.modifiedCount === 0) {
                throw new errorInstance_1.default("updation failed try again", statusCode_1.default.NO_CONTENT);
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
                        // paymentStatus: "paid",
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
                        revenue: { $sum: 50 },
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
            return { data: data };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getReport() {
        try {
            const data = await reportSchema_1.default.aggregate([
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
                        from: "providers",
                        localField: "providerId",
                        foreignField: "_id",
                        as: "provider",
                    },
                },
                { $unwind: "$user" },
                { $unwind: "$provider" },
                {
                    $project: {
                        _id: 1,
                        "user.name": 1,
                        "user.logoUrl": 1,
                        "provider.workshopName": 1,
                        "provider.logoUrl": 1,
                        userId: 1,
                        providerId: 1,
                        BookingId: 1,
                        report: 1,
                        status: 1,
                    },
                },
            ]);
            return { data: data.length > 0 ? data : [] };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async editReport(id, status) {
        try {
            const updateOne = await reportSchema_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(id) }, {
                $set: {
                    status: status,
                },
            });
            if (updateOne.modifiedCount === 0) {
                throw new errorInstance_1.default("Something went wrong try again after few minutes", statusCode_1.default.Unprocessable_Entity);
            }
            return { success: true };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getReportDeatils(id) {
        try {
            const [data] = await reportSchema_1.default.aggregate([
                { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
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
                        from: "providers",
                        localField: "providerId",
                        foreignField: "_id",
                        as: "provider",
                    },
                },
                {
                    $lookup: {
                        from: "servicebookings",
                        localField: "BookingId",
                        foreignField: "_id",
                        as: "bookings",
                    },
                },
                { $unwind: "$bookings" },
                {
                    $lookup: {
                        from: "bookingdates",
                        localField: "bookings.date",
                        foreignField: "_id",
                        as: "bookeddate",
                    },
                },
                {
                    $lookup: {
                        from: "servicetypes",
                        localField: "bookings.serviceType",
                        foreignField: "_id",
                        as: "servicename",
                    },
                },
                { $unwind: "$user" },
                { $unwind: "$provider" },
                { $unwind: "$bookeddate" },
                { $unwind: "$servicename" },
                {
                    $project: {
                        _id: 1,
                        "user.name": 1,
                        "user.logoUrl": 1,
                        "provider.workshopName": 1,
                        "provider.logoUrl": 1,
                        userId: 1,
                        providerId: 1,
                        BookingId: 1,
                        report: 1,
                        status: 1,
                        "bookings.vechileDetails": 1,
                        "bookings.selectedService": 1,
                        "bookings.advanceAmount": 1,
                        "bookings.advance": 1,
                        "bookings.status": 1,
                        "bookings.amountpaid": 1,
                        "bookings.paymentStatus": 1,
                        "bookeddate.date": 1,
                        "servicename.serviceType": 1,
                    },
                },
            ]);
            return { data: data };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.statusCode);
        }
    }
    async getSalesReport(year, month) {
        try {
            const data = await ServiceBookingModel_1.default.aggregate([
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
                {
                    $lookup: {
                        from: "providers",
                        localField: "providerId",
                        foreignField: "_id",
                        as: "provider",
                    },
                },
                { $unwind: "$provider" },
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
                    $project: {
                        _id: 1,
                        "service.serviceType": 1,
                        "user.name": 1,
                        "selectedDate.date": 1,
                        "provider.workshopName": 1,
                        selectedService: 1,
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
exports.default = AdminRepository;
