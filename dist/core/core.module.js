"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const joi_1 = __importDefault(require("joi"));
const core_1 = require("@nestjs/core");
const mongoose_1 = require("@nestjs/mongoose");
const config_2 = require("../config");
const transform_response_interceptor_1 = require("./interceptors/transform-response.interceptor");
const casl_module_1 = require("./casl/casl.module");
const utils_1 = require("./utils/utils");
const jwt_employee_auth_guard_1 = require("./guards/jwt-employee-auth.guard");
const errors_exception_1 = require("./exceptions/errors.exception");
const any_exception_filter_1 = __importDefault(require("./exceptions/any-exception-filter"));
const roles_guard_1 = require("./guards/roles.guard");
const throttler_1 = require("@nestjs/throttler");
const api_key_guard_1 = require("./guards/api-key.guard");
let CoreModule = class CoreModule {
};
exports.CoreModule = CoreModule;
exports.CoreModule = CoreModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 1000,
                        limit: 2
                    }
                ]
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [config_2.environment, config_2.port, config_2.database, config_2.token, config_2.upload, config_2.client, config_2.server],
                validationSchema: joi_1.default.object({
                    NODE_ENV: joi_1.default.string().valid('development', 'production', 'test', 'provision').required(),
                    PORT: joi_1.default.number().port().required(),
                    DATABASE_URI: joi_1.default.string().required(),
                    EMPLOYEE_ACCESS_TOKEN_SECRET: joi_1.default.string().required(),
                    EMPLOYEE_ACCESS_TOKEN_EXPIRATION_TIME: joi_1.default.string().required(),
                    EMPLOYEE_REFRESH_TOKEN_SECRET: joi_1.default.string().required(),
                    EMPLOYEE_REFRESH_TOKEN_EXPIRATION_TIME: joi_1.default.string().required(),
                    MULTER_DEFAULT_DEST: joi_1.default.string().required(),
                    CLIENT_BASE_URL: joi_1.default.string().required(),
                    TABLE_TOKEN_SECRET: joi_1.default.string().required(),
                    CUSTOMER_ACCESS_TOKEN_EXPIRATION_TIME: joi_1.default.string().required(),
                    CUSTOMER_REFRESH_TOKEN_EXPIRATION_TIME: joi_1.default.string().required(),
                    CUSTOMER_ACCESS_TOKEN_SECRET: joi_1.default.string().required(),
                    CUSTOMER_REFRESH_TOKEN_SECRET: joi_1.default.string().required(),
                    SERVER_BASE_URL: joi_1.default.string().required(),
                    CLOUDINARY_API_KEY: joi_1.default.string().required(),
                    CLOUDINARY_API_SECRET: joi_1.default.string().required(),
                    CLOUDINARY_CLOUD_NAME: joi_1.default.string().required(),
                    API_KEY: joi_1.default.string().required()
                })
            }),
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: async (configService) => ({
                    uri: configService.get('databaseUri')
                }),
                inject: [config_1.ConfigService]
            }),
            casl_module_1.CaslModule
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_GUARD, useClass: api_key_guard_1.ApiKeyGuard },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_employee_auth_guard_1.JwtEmployeeAuthGuard
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_response_interceptor_1.TransformResponseInterceptor
            },
            {
                provide: core_1.APP_PIPE,
                useValue: new common_1.ValidationPipe({
                    whitelist: true,
                    transform: true,
                    transformOptions: { enableImplicitConversion: true },
                    stopAtFirstError: true,
                    exceptionFactory: (validationErrors = []) => {
                        const errorMessage = (0, utils_1.extractErrorMessageFromDto)(validationErrors);
                        return new errors_exception_1.UnprocessableEntityError(validationErrors.map((error, index) => ({
                            field: error.property,
                            message: errorMessage[index]
                        })));
                    }
                })
            },
            {
                provide: core_1.APP_FILTER,
                useClass: any_exception_filter_1.default
            }
        ],
        exports: []
    })
], CoreModule);
//# sourceMappingURL=core.module.js.map