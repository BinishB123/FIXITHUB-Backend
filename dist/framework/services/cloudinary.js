"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const errorInstance_1 = __importDefault(require("./errorInstance"));
const statusCode_1 = __importDefault(require("../../entities/rules/statusCode"));
dotenv_1.default.config();
// Configure Cloudinary with environment variables
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
class Cloudinary {
    async uploadToCloudinary(fileBuffer, folder = "FixitHub") {
        const uniqueId = `FixithubImages_${Date.now()}`;
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload(`data:image/jpeg;base64,${fileBuffer.toString("base64")}`, {
                folder: folder,
                public_id: uniqueId,
                resource_type: "image",
            }, (error, result) => {
                if (error) {
                    console.error("Error uploading to Cloudinary:", error);
                    return reject({ success: false, message: "Upload failed" });
                }
                resolve({ success: true, url: result?.secure_url });
            });
        });
    }
    async deleteFromCloudinary(url, FolderNameThatContainImage) {
        try {
            const publicId = url?.split("/").reverse()[0].split(".")[0];
            const result = await cloudinary_1.v2.uploader.destroy(FolderNameThatContainImage + "/" + publicId);
            console.log(result);
            if (result.result !== "ok") {
                throw new errorInstance_1.default("Something went Wrong", statusCode_1.default.Unprocessable_Entity);
            }
            console.log("Deletion result", result);
            return { success: true };
        }
        catch (error) {
            throw new errorInstance_1.default(error.message, error.status);
        }
    }
    async uploadArrayOfImages(fileBuffer, folder) {
        const uploadPromises = fileBuffer.map((file, index) => {
            const uniqueId = `FixithubImages_${Date.now()}_${index}`;
            return new Promise((resolve) => {
                cloudinary_1.v2.uploader.upload(`data:image/jpeg;base64,${file.toString("base64")}`, {
                    folder: folder,
                    public_id: uniqueId,
                    resource_type: "image",
                }, (error, result) => {
                    if (error) {
                        console.error("Error uploading to Cloudinary:", error);
                        resolve({ message: "Upload failed" });
                    }
                    else {
                        resolve({ url: result?.secure_url });
                    }
                });
            });
        });
        const results = await Promise.allSettled(uploadPromises);
        const response = results.map((result) => result.status === "fulfilled"
            ? { url: result.value.url }
            : { message: "Upload failed" });
        const success = response.every((r) => r.url);
        return { success, results: response };
    }
}
exports.default = Cloudinary;
