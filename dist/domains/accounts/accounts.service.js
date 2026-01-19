"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = __importStar(require("bcrypt"));
const errors_exception_1 = require("../../core/exceptions/errors.exception");
const account_schema_1 = require("./schemas/account.schema");
const mongoose_2 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
let AccountsService = class AccountsService {
    constructor(accountModel, configService) {
        this.accountModel = accountModel;
        this.configService = configService;
        this.saltRounds = 10;
    }
    async create(createAccountDto) {
        const isExistAccount = await this.accountModel.findOne({ email: createAccountDto.email });
        if (isExistAccount) {
            throw new errors_exception_1.UnprocessableEntityError([{ field: 'email', message: 'Email này đã tồn tại trên hệ thống' }]);
        }
        const hashedPassword = await this.hashPassword(createAccountDto.password);
        const newAccount = await this.accountModel.create({
            ...createAccountDto,
            password: hashedPassword,
            _id: createAccountDto._id
        });
        return {
            _id: newAccount._id,
            email: newAccount.email,
            fullName: newAccount.fullName,
            avatarUrl: newAccount.avatarUrl,
            role: newAccount.role
        };
    }
    async findAll(qs) {
        const { page, limit, sort: sortQuery, ...filter } = qs;
        const sortField = sortQuery?.split('.')?.[0];
        const sort = sortQuery?.split('.')?.[1] === 'desc' ? `-${sortField}` : sortField;
        const query = this.accountModel.find(filter);
        if (limit && page) {
            query
                .skip((page - 1) * limit)
                .limit(limit)
                .sort(sort);
        }
        const [data, totalDocuments] = await Promise.all([query, this.accountModel.countDocuments(filter)]);
        return {
            data,
            meta: {
                page: page || 1,
                limit: limit || totalDocuments,
                totalPages: limit ? Math.ceil(totalDocuments / limit) : 1,
                totalDocuments
            }
        };
    }
    async findOne(id) {
        const account = await this.accountModel.findOne({ _id: id });
        if (!account) {
            throw new errors_exception_1.NotFoundError('Tài khoản không tồn tại');
        }
        return this.accountModel.findById(id);
    }
    findByEmail(email) {
        return this.accountModel.findOne({ email });
    }
    findByRefreshToken(refreshToken) {
        return this.accountModel.findOne({ refreshToken });
    }
    async findAccountByEmailAndPassword({ email, password }) {
        const account = await this.findByEmail(email);
        if (!account)
            return null;
        const decryptedPassword = this.decryptPassword(password);
        const isMatchPassword = await this.comparePassword(decryptedPassword, account.password);
        return isMatchPassword ? account : null;
    }
    async update(id, updateAccountDto) {
        const account = await this.accountModel.findOne({ _id: id });
        if (!account) {
            throw new errors_exception_1.NotFoundError('Tài khoản không tồn tại');
        }
        return this.accountModel.updateOne({ _id: id }, { ...updateAccountDto });
    }
    async updateRefreshToken(id, refreshToken) {
        return this.accountModel.updateOne({ _id: id }, { refreshToken });
    }
    async updatePassword(id, password) {
        const hashedPassword = await this.hashPassword(password);
        return this.accountModel.updateOne({ _id: id }, {
            password: hashedPassword
        });
    }
    async remove(id) {
        const account = await this.accountModel.findOne({ _id: id });
        if (!account) {
            throw new errors_exception_1.NotFoundError('Tài khoản không tồn tại');
        }
        return this.accountModel.deleteOne({ _id: id });
    }
    hashPassword(password) {
        return bcrypt.hash(password, this.saltRounds);
    }
    comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
    decryptPassword(encryptedPassword) {
        try {
            const privateKey = fs.readFileSync(path_1.default.join(process.cwd(), 'src/config/private-key.pem'));
            const password = crypto_1.default
                .privateDecrypt({
                key: privateKey,
                padding: crypto_1.default.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha1'
            }, Buffer.from(encryptedPassword, 'base64'))
                .toString();
            if (!password) {
                throw new errors_exception_1.BadRequestError('Giải mã password thất bại');
            }
            return password;
        }
        catch (error) {
            throw new errors_exception_1.BadRequestError(error.message ?? 'Giải mã password thất bại');
        }
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(account_schema_1.Account.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map