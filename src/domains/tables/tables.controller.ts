import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { TablesService } from './tables.service'
import { CreateTableDto } from './dto/create-table.dto'
import { UpdateTableDto } from './dto/update-table.dto'
import { QueryType } from 'core/types/type'
import { ValidateMongoIdPipe } from 'core/pipes/validate-mongo-id.pipe'

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto)
  }

  @Get()
  findAll(@Query() qs: QueryType) {
    return this.tablesService.findAll(qs)
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.tablesService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id', ValidateMongoIdPipe) id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(id, updateTableDto)
  }

  @Delete(':id')
  remove(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.tablesService.remove(id)
  }
}
