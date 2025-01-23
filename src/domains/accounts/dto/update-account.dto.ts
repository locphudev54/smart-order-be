import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateAccountDto } from './create-account.dto'

export class UpdateAccountDto extends OmitType(PartialType(CreateAccountDto), ['password'] as const) {}
