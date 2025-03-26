import { IsMongoId, IsNotEmpty } from 'class-validator'
import { Types } from 'mongoose'

export class CheckoutOrdersDto {
  @IsMongoId({ message: 'tableId phải là định dạng ObjectId' })
  @IsNotEmpty({ message: 'tableId không được bỏ trống' })
  tableId: Types.ObjectId
}
