import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { TablesService } from './tables.service'
import { CreateTableDto } from './dto/create-table.dto'
import { UpdateTableDto } from './dto/update-table.dto'
import { ValidateMongoIdPipe } from 'core/pipes/validate-mongo-id.pipe'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { TableQueryDto } from 'domains/tables/dto/table-query.dto'
import { ResponseMessage } from 'core/decorators/response-message.decorator'

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @ResponseMessage('Tạo bàn mới thành công')
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto)
  }

  @Get()
  @ResponseMessage('Lấy danh sách bàn thành công')
  findAll(@Query() paginationQuery: PaginationQueryDto, @Query() tableQuery: TableQueryDto) {
    return this.tablesService.findAll({ ...paginationQuery, ...tableQuery })
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin bàn thành công')
  findOne(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.tablesService.findOne(id)
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thông tin bàn thành công')
  update(@Param('id', ValidateMongoIdPipe) id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.tablesService.update(id, updateTableDto)
  }

  @Delete(':id')
  @ResponseMessage('Xóa bàn thành công')
  remove(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.tablesService.remove(id)
  }
}
