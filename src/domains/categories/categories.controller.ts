import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Public } from 'core/decorators/public.decorator'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { ResponseMessage } from 'core/decorators/response-message.decorator'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto)
  }

  @Public()
  @Get()
  @ResponseMessage('Lấy danh sách danh mục món thành công')
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.categoriesService.findAll({ ...paginationQuery })
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id)
  }
}
