import { PartialType } from '@nestjs/mapped-types'
import { CreateTableDto } from './create-table.dto'
import { IsBoolean, IsBooleanString, IsMongoId, IsOptional } from 'class-validator'
import { Types } from 'mongoose'
import { Transform, Type } from 'class-transformer'
import { UnprocessableEntityError } from 'core/exceptions/errors.exception'

export class UpdateTableDto extends PartialType(CreateTableDto) {
  @Transform(({ value }) => {
    if (+value === 1) return true
    if (+value === 0) return false
    throw new UnprocessableEntityError([
      { field: 'changeToken', message: 'changeToken phải có kiểu dữ liệu dạng số: 1 (đổi tableToken) || 0 (ngược lại)' }
    ])
  })
  @IsOptional()
  changeToken?: boolean

  @IsMongoId({ message: 'customer phải là định dạng ObjectId' })
  @IsOptional()
  customer?: Types.ObjectId
}
