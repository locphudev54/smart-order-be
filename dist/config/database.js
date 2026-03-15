"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    databaseUri: process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_DATABASE_URI : process.env.DEVELOPMENT_DATABASE_URI
});
//# sourceMappingURL=database.js.map