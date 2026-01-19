import { Role } from 'core/constants/enum';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: (Role | Role[])[]) => import("@nestjs/common").CustomDecorator<string>;
