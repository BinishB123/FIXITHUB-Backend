import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { IUploadToCloudinary } from "../../entities/services/Iclodinary";
import { error } from "console";
import CustomError from "./errorInstance";
import HttpStatus from "../../entities/rules/statusCode";
import { resolve } from "path";

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

class Cloudinary implements IUploadToCloudinary {
    async uploadToCloudinary(
        fileBuffer: Buffer,
        folder: string = "FixitHub"
    ): Promise<{ success: boolean; url?: string; message?: string }> {
        const uniqueId = `FixithubImages_${Date.now()}`;

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                `data:image/jpeg;base64,${fileBuffer.toString("base64")}`,
                {
                    folder: folder,
                    public_id: uniqueId,
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) {
                        console.error("Error uploading to Cloudinary:", error);
                        return reject({ success: false, message: "Upload failed" });
                    }
                    resolve({ success: true, url: result?.secure_url });
                }
            );
        });
    }

    async deleteFromCloudinary(
        url: string,
        FolderNameThatContainImage: string
    ): Promise<{ success?: boolean; message?: string }> {
        try {
            const publicId = url?.split("/").reverse()[0].split(".")[0];
            const result = await cloudinary.uploader.destroy(
                FolderNameThatContainImage + "/" + publicId
            );
            console.log(result);

            if (result.result !== "ok") {
                throw new CustomError(
                    "Something went Wrong",
                    HttpStatus.Unprocessable_Entity
                );
            }

            console.log("Deletion result", result);
            return { success: true };
        } catch (error: any) {
            throw new CustomError(error.message, error.status);
        }
    }

    async uploadArrayOfImages(
        fileBuffer: Buffer[],
        folder: string
    ): Promise<{
        success: boolean;
        results: { url?: string; message?: string }[];
    }> {
        const uploadPromises = fileBuffer.map((file, index) => {
            const uniqueId = `FixithubImages_${Date.now()}_${index}`;
            return new Promise<{ url?: string; message?: string }>((resolve) => {
                cloudinary.uploader.upload(
                    `data:image/jpeg;base64,${file.toString("base64")}`,
                    {
                        folder: folder,
                        public_id: uniqueId,
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Error uploading to Cloudinary:", error);
                            resolve({ message: "Upload failed" });
                        } else {
                            resolve({ url: result?.secure_url });
                        }
                    }
                );
            });
        });

        const results = await Promise.allSettled(uploadPromises);

        const response = results.map((result) =>
            result.status === "fulfilled"
                ? { url: result.value.url }
                : { message: "Upload failed" }
        );

        const success = response.every((r) => r.url);

        return { success, results: response };
    }
}

export default Cloudinary;
