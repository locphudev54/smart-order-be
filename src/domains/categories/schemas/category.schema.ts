import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type CategoryDocument = HydratedDocument<Category>

@Schema({ timestamps: true, versionKey: false, collection: 'Categories' })
export class Category {
  @Prop({ required: true, type: String })
  title: string
}

export const CategorySchema = SchemaFactory.createForClass(Category)
