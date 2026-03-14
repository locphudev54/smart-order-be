import { Strategy } from 'passport-local';
import { CustomerType } from 'core/types/type';
import { CustomersService } from 'domains/customers/customers.service';
import { JwtService } from '@nestjs/jwt';
declare const LocalCustomerStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalCustomerStrategy extends LocalCustomerStrategy_base {
    private customersService;
    private readonly jwtService;
    constructor(customersService: CustomersService, jwtService: JwtService);
    validate(tableToken: string): Promise<CustomerType>;
}
export {};
