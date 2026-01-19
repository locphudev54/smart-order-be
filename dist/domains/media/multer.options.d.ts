export declare const createMulterOptions: (limitFileSize: number) => {
    limits: {
        fileSize: number;
    };
    fileFilter: (req: any, file: Express.Multer.File, callback: any) => any;
};
