import { ConfigService } from '@nestjs/config';
import { AccountType, AuthTokenPayload } from 'core/types/type';
import { Strategy } from 'passport-jwt';
declare const JwtEmployeeStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtEmployeeStrategy extends JwtEmployeeStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(payload: AuthTokenPayload): AccountType;
}
export {};
