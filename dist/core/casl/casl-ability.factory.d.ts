import { InferSubjects, MongoAbility, MongoQuery } from '@casl/ability';
import { Action } from 'core/constants/cals';
import { Dish } from 'domains/dishes/schemas/dish.schema';
import { AccountType } from 'core/types/type';
type Subjects = InferSubjects<typeof Dish | AccountType> | 'all';
type PossibleAbilities = [Action, Subjects];
type Conditions = MongoQuery;
export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;
export declare class CaslAbilityFactory {
    createForUser(account: AccountType): MongoAbility<[Action, Subjects], MongoQuery>;
}
export {};
