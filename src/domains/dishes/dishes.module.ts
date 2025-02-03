import { Module } from '@nestjs/common'
import { DishesService } from './dishes.service'
import { DishesController } from './dishes.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Dish, DishSchema } from 'domains/dishes/schemas/dish.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Dish.name, schema: DishSchema }])],
  controllers: [DishesController],
  providers: [DishesService],
  exports: [DishesService]
})
export class DishesModule {}
