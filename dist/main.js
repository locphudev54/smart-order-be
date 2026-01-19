"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('port');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        prefix: 'api/v',
        defaultVersion: '1'
    });
    app.useStaticAssets(path_1.default.join(__dirname, '../upload'), {
        prefix: '/public/'
    });
    app.enableCors({ origin: '*' });
    app.use((0, cookie_parser_1.default)());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Smart Order')
        .setDescription('SOA Spring, 2025 - TDTU')
        .setVersion('1.0')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, documentFactory, {
        jsonDocumentUrl: 'docs/json'
    });
    app.use((0, helmet_1.default)());
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map