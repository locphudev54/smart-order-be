import { Controller, Get, UseGuards } from '@nestjs/common'
import { AppAbility } from 'core/casl/casl-ability.factory'
import { Action } from 'core/constants/cals'
import { Role } from 'core/constants/enum'
import { CheckPolicies } from 'core/decorators/check-policies.decorator'
import { Roles } from 'core/decorators/roles.decorator'
import { PoliciesGuard } from 'core/guards/policies.guard'
import { Dish } from 'domains/dishes/schemas/dish.schema'
@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Roles(Role.Manager, Role.Chef, Role.Customer)
  getHello() {
    return 'Xin chào các bạn'
  }

  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Dish))
  testPoliciecGuard() {
    return 'test polices guard'
  }
}
