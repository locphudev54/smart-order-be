import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateDishDto } from './dto/create-dish.dto'
import { UpdateDishDto } from './dto/update-dish.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Dish } from 'domains/dishes/schemas/dish.schema'
import { Model } from 'mongoose'
import { QueryType } from 'core/types/type'
import aqp from 'api-query-params'

@Injectable()
export class DishesService {
  constructor(@InjectModel(Dish.name) private dishModel: Model<Dish>) {}

  create(createDishDto: CreateDishDto) {
    return this.dishModel.create(createDishDto)
  }

  async findAll(qs: QueryType) {
    const page = Number(qs.page) || 1
    const limit = Number(qs.limit) || 10
    delete qs.page
    delete qs.limit

    const skip = (page - 1) * limit
    const { filter, sort, projection, population } = aqp(qs)

    const [result, totalDocument] = await Promise.all([
      this.dishModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort as any)
        .select(projection)
        .populate(population),
      this.dishModel.find(filter)
    ])
    const totalPage = Math.ceil(totalDocument.length / result.length)

    return {
      data: result,
      meta: {
        page,
        limit: result.length,
        totalPage
      }
    }
  }

  async findOne(id: string) {
    const dish = await this.dishModel.findById(id)
    if (!dish) {
      throw new NotFoundException('Món ăn không tồn tại')
    }
    return dish
  }

  async update(id: string, updateDishDto: UpdateDishDto) {
    const dish = await this.dishModel.findById(id)
    if (!dish) {
      throw new NotFoundException('Món ăn không tồn tại')
    }
    return this.dishModel.updateOne({ _id: id }, updateDishDto)
  }

  async remove(id: string) {
    const dish = await this.dishModel.findById(id)
    if (!dish) {
      throw new NotFoundException('Món ăn không tồn tại')
    }
    return this.dishModel.deleteOne({ _id: id })
  }
}
