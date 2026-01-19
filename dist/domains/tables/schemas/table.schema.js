"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableSchema = exports.Table = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const enum_1 = require("../../../core/constants/enum");
const mongoose_2 = __importDefault(require("mongoose"));
let Table = class Table {
};
exports.Table = Table;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, type: Number }),
    __metadata("design:type", Number)
], Table.prototype, "number", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: String, enum: enum_1.TableStatus, default: enum_1.TableStatus.Available }),
    __metadata("design:type", String)
], Table.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Customer', default: null }),
    __metadata("design:type", Object)
], Table.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, type: String }),
    __metadata("design:type", String)
], Table.prototype, "reservationLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, type: String }),
    __metadata("design:type", String)
], Table.prototype, "token", void 0);
exports.Table = Table = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, versionKey: false, collection: 'Tables' })
], Table);
exports.TableSchema = mongoose_1.SchemaFactory.createForClass(Table);
//# sourceMappingURL=table.schema.js.map