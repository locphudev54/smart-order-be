import { Transform, Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'
import { endOfDay, startOfDay } from 'date-fns'

export class DateRangeQueryDto {
  @IsDate({ message: 'from không đúng định dạng DateString' })
  @Transform(({ value }: { value: string }) => startOfDay(value))
  @IsOptional()
  from?: Date | undefined

  @IsDate({ message: 'to không đúng định dạng DateString' })
  @Transform(({ value }: { value: string }) => endOfDay(value))
  @IsOptional()
  to?: Date | undefined
}
