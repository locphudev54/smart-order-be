import { CreateAccountDto } from './create-account.dto';
declare const UpdateAccountDto_base: import("@nestjs/mapped-types").MappedType<Omit<Partial<CreateAccountDto>, "email" | "password">>;
export declare class UpdateAccountDto extends UpdateAccountDto_base {
}
export {};
