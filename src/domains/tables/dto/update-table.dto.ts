import { PartialType } from '@nestjs/mapped-types'
import { Transform } from 'class-transformer'
import { IsMongoId, IsOptional } from 'class-validator'
import { UnprocessableEntityError } from 'core/exceptions/errors.exception'
import { Types } from 'mongoose'
import { CreateTableDto } from './create-table.dto'

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
