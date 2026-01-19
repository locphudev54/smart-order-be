import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Request } from 'express';
export declare class CloudinaryService {
    uploadFile(file: Express.Multer.File, req: Request): Promise<UploadApiResponse | UploadApiErrorResponse>;
    uploadFiles(files: Express.Multer.File[], req: Request): Promise<string[]>;
}
