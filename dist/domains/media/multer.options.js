"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMulterOptions = void 0;
const media_upload_utils_1 = require("./media-upload.utils");
const createMulterOptions = (limitFileSize) => ({
    limits: {
        fileSize: limitFileSize
    },
    fileFilter: media_upload_utils_1.imageFileFilter
});
exports.createMulterOptions = createMulterOptions;
//# sourceMappingURL=multer.options.js.map