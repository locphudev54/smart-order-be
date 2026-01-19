import { Strategy } from 'passport-local';
import { AuthService } from 'domains/auth/auth.service';
import { AccountType } from 'core/types/type';
declare const LocalEmployeeStrategy_base: new (...args: [] | [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LocalEmployeeStrategy extends LocalEmployeeStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<AccountType>;
}
export {};
