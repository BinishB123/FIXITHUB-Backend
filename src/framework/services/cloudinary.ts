import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { IUploadToCloudinary } from '../../entities/services/Iclodinary';

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

class Cloudinary implements IUploadToCloudinary {
   
    async uploadToCloudinary(fileBuffer: Buffer, folder: string="FixitHub", publicId: string="FixithubImages"): Promise<{ success: boolean; url?: string; message?: string; }> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    public_id: publicId, 
                    resource_type: 'image',
                }, 
                (error, result) => {
                    if (error) {
                        console.error('Error uploading to Cloudinary:', error);
                        return reject({ success: false, message: 'Upload failed' });
                    }
                    resolve({ success: true, url: result?.secure_url });
                }
            ).end(fileBuffer);
        });
    }

    
}

export default Cloudinary;
