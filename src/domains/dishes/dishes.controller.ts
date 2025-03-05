import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { Public } from 'core/decorators/public.decorator'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { ValidateMongoIdPipe } from 'core/pipes/validate-mongo-id.pipe'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { DishQueryDto } from 'domains/dishes/dto/dish-query.dto'
import { DishesService } from './dishes.service'
import { CreateDishDto } from './dto/create-dish.dto'
import { UpdateDishDto } from './dto/update-dish.dto'
@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Post()
  @ResponseMessage('Tạo món ăn thành công')
  create(@Body() createDishDto: CreateDishDto) {
    return this.dishesService.create(createDishDto)
  }

  @Public()
  @Get()
  @ResponseMessage('Lấy danh sách món ăn thành công')
  findAll(@Query() paginationQuery: PaginationQueryDto, @Query() tableQuery: DishQueryDto) {
    return this.dishesService.findAll({ ...paginationQuery, ...tableQuery })
  }

  @Get(':id')
  @ResponseMessage('Lấy chi tiết món ăn thành công')
  findOne(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.dishesService.findOne(id)
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật món ăn thành công')
  update(@Param('id', ValidateMongoIdPipe) id: string, @Body() updateDishDto: UpdateDishDto) {
    return this.dishesService.update(id, updateDishDto)
  }

  @Delete(':id')
  @ResponseMessage('Xóa món ăn thành công')
  remove(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.dishesService.remove(id)
  }
}
