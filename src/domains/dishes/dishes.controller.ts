import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { DishesService } from './dishes.service'
import { CreateDishDto } from './dto/create-dish.dto'
import { UpdateDishDto } from './dto/update-dish.dto'
import { QueryType } from 'core/types/type'
import { ValidateMongoIdPipe } from 'core/pipes/validate-mongo-id.pipe'
import { Public } from 'core/decorators/public.decorator'

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Post()
  create(@Body() createDishDto: CreateDishDto) {
    return this.dishesService.create(createDishDto)
  }

  @Public()
  @Get()
  findAll(@Query() qs: QueryType) {
    return this.dishesService.findAll(qs)
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.dishesService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ValidateMongoIdPipe) id: string, @Body() updateDishDto: UpdateDishDto) {
    return this.dishesService.update(id, updateDishDto)
  }

  @Delete(':id')
  remove(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.dishesService.remove(id)
  }
}
