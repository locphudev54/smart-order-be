"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatedUserAccess = exports.IS_AUTHENTICATED_USER_ACCESS = void 0;
const common_1 = require("@nestjs/common");
exports.IS_AUTHENTICATED_USER_ACCESS = 'isAuthenticatedUserAccess';
const AuthenticatedUserAccess = () => (0, common_1.SetMetadata)(exports.IS_AUTHENTICATED_USER_ACCESS, true);
exports.AuthenticatedUserAccess = AuthenticatedUserAccess;
//# sourceMappingURL=authenticated-user-access.decorator.js.map