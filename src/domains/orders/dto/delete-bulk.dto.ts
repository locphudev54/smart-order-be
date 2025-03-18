import { ArrayMinSize, IsMongoId } from 'class-validator'
import { IsUniqueArray } from 'core/decorators/is-unique-array.decorator'
import { Types } from 'mongoose'

export class DeleteBulkDto {
  @IsUniqueArray('Các phần tử trong ids không được trùng lặp')
  @IsMongoId({
    each: true,
    message: `Các phần tử trong ids phải là ObjectId`
  })
  @ArrayMinSize(1, { message: 'ids phải có ít một phần tử' })
  ids: Types.ObjectId[]
}
