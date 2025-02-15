// Define an interface for the Cloudinary upload function
export interface IUploadToCloudinary {
    uploadToCloudinary (fileBuffer: Buffer, folder: string, publicId: string): Promise<{ success: boolean; url?: string; message?: string }>;
    deleteFromCloudinary(url:string,FolderNameThatContainImage:string):Promise<{success?:boolean,message?:string}>
    uploadArrayOfImages(fileBuffer: Buffer[], folder: string, publicId: string): Promise<{ success: boolean; results: { url?: string; message?: string }[] }>;
  }
  