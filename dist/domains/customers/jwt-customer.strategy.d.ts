import { ConfigService } from '@nestjs/config';
import { CustomerTokenPayload, CustomerType } from 'core/types/type';
import { Strategy } from 'passport-jwt';
declare const JwtCustomerStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtCustomerStrategy extends JwtCustomerStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(payload: CustomerTokenPayload): CustomerType;
}
export {};
