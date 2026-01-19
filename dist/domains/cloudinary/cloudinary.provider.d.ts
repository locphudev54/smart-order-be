import { ConfigService } from '@nestjs/config';
export declare const CloudinaryProvider: {
    provide: string;
    useFactory: (configService: ConfigService) => Promise<import("cloudinary").ConfigOptions>;
    inject: (typeof ConfigService)[];
};
