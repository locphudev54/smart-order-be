import { PartialType } from '@nestjs/mapped-types'
import { CreateTableDto } from './create-table.dto'
import { IsBoolean, IsMongoId, IsOptional } from 'class-validator'
import { Types } from 'mongoose'

export class UpdateTableDto extends PartialType(CreateTableDto) {
  @IsBoolean({ message: 'changeToken phải có kiểu dữ liệu boolean' })
  @IsOptional()
  changeToken?: boolean

  @IsMongoId({ message: 'customer phải là định dạng ObjectId' })
  @IsOptional()
  customer?: Types.ObjectId
}
