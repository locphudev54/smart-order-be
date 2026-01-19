import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare class IsUniqueArrayConstraint implements ValidatorConstraintInterface {
    validate(value: any[], args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): any;
}
