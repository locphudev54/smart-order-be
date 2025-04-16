import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { NotFoundError } from 'core/exceptions/errors.exception'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { DishQueryDto } from 'domains/dishes/dto/dish-query.dto'
import { Dish, DishDocument } from 'domains/dishes/schemas/dish.schema'
import { FilterQuery, Model } from 'mongoose'
import { CreateDishDto } from './dto/create-dish.dto'
import { UpdateDishDto } from './dto/update-dish.dto'
import { Category, CategoryDocument } from 'domains/categories/schemas/category.schema'

@Injectable()
export class DishesService {
  constructor(@InjectModel(Dish.name) private readonly dishModel: Model<DishDocument>) {}

  create(createDishDto: CreateDishDto) {
    return this.dishModel.create(createDishDto)
  }

  async findAll(qs: PaginationQueryDto & DishQueryDto) {
    const { page, limit, sort: sortQuery, keyword } = qs
    const filter: FilterQuery<Category> = {}

    let sort = '-createdAt'
    if (sortQuery) {
      const sortField = sortQuery.split('.')[0]
      const isDescending = sortQuery.split('.')[1] === 'desc'
      sort = isDescending ? `-${sortField}` : sortField
    }

    // Full Text Search in Mongoose
    if (keyword) {
      filter.$text = { $search: keyword }
    }

    const query = this.dishModel.find(filter).populate([{ path: 'category', select: ['_id', 'title'] }])

    if (limit && page) {
      query
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort)
    }

    const [data, totalDocuments] = await Promise.all([query, this.dishModel.countDocuments(filter)])

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

  async findOne(id: string) {
    const dish = await this.dishModel.findById(id)
    if (!dish) {
      throw new NotFoundError('Món ăn không tồn tại')
    }
    return dish
  }

  async update(id: string, updateDishDto: UpdateDishDto) {
    const dish = await this.dishModel.findById(id)
    if (!dish) {
      throw new NotFoundError('Món ăn không tồn tại')
    }
    return this.dishModel.updateOne({ _id: id }, updateDishDto)
  }

  async remove(id: string) {
    const dish = await this.dishModel.findById(id)
    if (!dish) {
      throw new NotFoundError('Món ăn không tồn tại')
    }
    return this.dishModel.deleteOne({ _id: id })
  }
}
