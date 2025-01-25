import { Injectable } from '@nestjs/common'
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  MongoQuery
} from '@casl/ability'
import { Action } from 'core/constants/cals'
import { Dish } from 'domains/dishes/schemas/dish.schema'
import { Role } from 'core/constants/enum'
import { AccountType } from 'core/types/type'

type Subjects = InferSubjects<typeof Dish | AccountType> | 'all' // 'all' -> special keyword in CASL that represents "any subject".
type PossibleAbilities = [Action, Subjects]
type Conditions = MongoQuery

export type AppAbility = MongoAbility<PossibleAbilities, Conditions>

@Injectable()
export class CaslAbilityFactory {
  createForUser(account: AccountType) {
    const { can, cannot, build } = new AbilityBuilder<MongoAbility<[Action, Subjects]>>(
      createMongoAbility<PossibleAbilities, Conditions>
    )

    if (account.role.includes(Role.Manager)) {
      can(Action.Manage, 'all') // read-write access to everything
    } else {
      can(Action.Read, 'all') // read-only access to everything
    }

    can(Action.Update, Dish, { title: 'Mon an 01' })
    cannot(Action.Delete, Dish, { title: 'Mon an 02' })

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>
    })
  }
}
