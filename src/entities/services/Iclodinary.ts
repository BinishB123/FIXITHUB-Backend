// Define an interface for the Cloudinary upload function
export interface IUploadToCloudinary {
    uploadToCloudinary (fileBuffer: Buffer, folder: string, publicId: string): Promise<{ success: boolean; url?: string; message?: string }>;
  }
  