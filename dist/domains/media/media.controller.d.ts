import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'domains/cloudinary/cloudinary.service';
import { MediaService } from 'domains/media/media.service';
import { Request as RequestType } from 'express';
export declare class MediaController {
    private readonly mediaService;
    private readonly configService;
    private readonly cloudinaryService;
    constructor(mediaService: MediaService, configService: ConfigService, cloudinaryService: CloudinaryService);
    uploadImage(file: any, req: RequestType): Promise<{
        result: any;
    }>;
    uploadMultipleFiles(files: any[], req: RequestType): Promise<{
        result: string[];
    }>;
}
