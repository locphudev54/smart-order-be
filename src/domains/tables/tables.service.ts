import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { QueryType } from 'core/types/type'
import aqp from 'api-query-params'
import { CreateTableDto } from 'domains/tables/dto/create-table.dto'
import { UpdateTableDto } from 'domains/tables/dto/update-table.dto'
import { Table, TableDocument } from 'domains/tables/schemas/table.schema'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { BadRequestError, NotFoundError } from 'core/exceptions/errors.exception'

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name) private readonly tableModel: Model<TableDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async create(createTableDto: CreateTableDto) {
    const { number } = createTableDto
    const tableWithNumber = await this.findTableByNumber(number)
    if (tableWithNumber) {
      throw new BadRequestError(`Bàn ăn với số hiệu ${number} đã tồn tại`)
    }

    const token = await this.signTableToken(number)
    const reservationLink = this.createReservationLink({ tableNumber: number, tableToken: token })

    return this.tableModel.create({ ...createTableDto, token, reservationLink })
  }

  async findAll(qs: QueryType) {
    const page = Number(qs.page) || 1
    const limit = Number(qs.limit) || 10
    delete qs.page
    delete qs.limit

    const skip = (page - 1) * limit
    const { filter, sort, projection, population } = aqp(qs)

    const [result, totalDocument] = await Promise.all([
      this.tableModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort as any)
        .select(projection)
        .populate(population),
      this.tableModel.find(filter)
    ])
    const totalPages = Math.ceil(totalDocument.length / result.length)

    return {
      data: result,
      meta: {
        page,
        limit: result.length,
        totalPages
      }
    }
  }

  async findOne(id: string) {
    const table = await this.tableModel.findById(id)
    if (!table) {
      throw new NotFoundError('Bàn không tồn tại')
    }
    return table
  }

  findTableByNumber(number: number) {
    return this.tableModel.findOne({ number })
  }

  findTableByToken(token: string) {
    return this.tableModel.findOne({ token })
  }

  async update(id: string, updateTableDto: UpdateTableDto) {
    const { changeToken, number } = updateTableDto

    const tableUpdate = await this.tableModel.findById(id)
    if (!tableUpdate) {
      throw new NotFoundError('Bàn không tồn tại')
    }

    const tableWithNumber = await this.findTableByNumber(number)
    if (tableWithNumber) {
      throw new BadRequestException(`Bàn ăn với số hiệu ${number} đã tồn tại`)
    }

    if (!changeToken) {
      return this.tableModel.findOneAndUpdate({ _id: id }, updateTableDto, { returnOriginal: false })
    } else {
      const newTableToken = await this.signTableToken(number)
      const reservationLink = this.createReservationLink({
        tableNumber: number || tableUpdate.number,
        tableToken: newTableToken
      })
      return this.tableModel.findOneAndUpdate(
        { _id: id },
        { ...updateTableDto, reservationLink, token: newTableToken },
        { returnOriginal: false }
      )
    }
  }

  async remove(id: string) {
    const table = await this.tableModel.findById(id)
    if (!table) {
      throw new NotFoundError('Bàn không tồn tại')
    }
    return this.tableModel.deleteOne({ _id: id })
  }

  signTableToken(tableNumber: number) {
    return this.jwtService.signAsync({ tableNumber }, { secret: this.configService.get('tableToken.secret') })
  }

  createReservationLink({ tableToken, tableNumber }: { tableToken: string; tableNumber: number }) {
    return `${this.configService.get<string>('client.baseUrl')}/tables/${tableNumber}?token=${tableToken}`
  }
}
