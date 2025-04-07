import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Category } from 'domains/categories/schemas/category.schema'
import { Model } from 'mongoose'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto)
  }

  async findAll(qs: PaginationQueryDto) {
    const { page, limit } = qs

    const query = this.categoryModel.find()

    if (limit && page) {
      query
        .skip((page - 1) * limit)
        .limit(limit)
        .sort('-createdAt')
    }

    const [data, totalDocuments] = await Promise.all([query, this.categoryModel.countDocuments()])

    return {
      data,
      meta: {
        page: page || 1,
        limit: limit || totalDocuments,
        totalPages: limit ? Math.ceil(totalDocuments / limit) : 1,
        totalDocuments
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} category`
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`
  }

  remove(id: number) {
    return `This action removes a #${id} category`
  }
}
