import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Request } from 'express';
export declare class CloudinaryService {
    uploadFile(file: any, req: Request): Promise<UploadApiResponse | UploadApiErrorResponse>;
    uploadFiles(files: any[], req: Request): Promise<string[]>;
}
