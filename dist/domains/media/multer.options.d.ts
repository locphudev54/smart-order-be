export declare const createMulterOptions: (limitFileSize: number) => {
    limits: {
        fileSize: number;
    };
    fileFilter: (req: any, file: any, callback: any) => any;
};
