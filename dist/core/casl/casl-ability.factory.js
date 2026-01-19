"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaslAbilityFactory = void 0;
const common_1 = require("@nestjs/common");
const ability_1 = require("@casl/ability");
const cals_1 = require("../constants/cals");
const dish_schema_1 = require("../../domains/dishes/schemas/dish.schema");
const enum_1 = require("../constants/enum");
let CaslAbilityFactory = class CaslAbilityFactory {
    createForUser(account) {
        const { can, cannot, build } = new ability_1.AbilityBuilder((ability_1.createMongoAbility));
        if (account.role.includes(enum_1.Role.Manager)) {
            can(cals_1.Action.Manage, 'all');
        }
        else {
            can(cals_1.Action.Read, 'all');
        }
        can(cals_1.Action.Update, dish_schema_1.Dish, { title: 'Mon an 01' });
        cannot(cals_1.Action.Delete, dish_schema_1.Dish, { title: 'Mon an 02' });
        return build({
            detectSubjectType: (item) => item.constructor
        });
    }
};
exports.CaslAbilityFactory = CaslAbilityFactory;
exports.CaslAbilityFactory = CaslAbilityFactory = __decorate([
    (0, common_1.Injectable)()
], CaslAbilityFactory);
//# sourceMappingURL=casl-ability.factory.js.map