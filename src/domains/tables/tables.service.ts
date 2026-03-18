import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { TableStatus } from 'core/constants/enum'
import { BadRequestError, NotFoundError } from 'core/exceptions/errors.exception'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { CustomersService } from 'domains/customers/customers.service'
import { CreateTableDto } from 'domains/tables/dto/create-table.dto'
import { TableQueryDto } from 'domains/tables/dto/table-query.dto'
import { UpdateTableDto } from 'domains/tables/dto/update-table.dto'
import { Table, TableDocument } from 'domains/tables/schemas/table.schema'
import { FilterQuery, Model } from 'mongoose'

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name) private readonly tableModel: Model<TableDocument>,
    @Inject(forwardRef(() => CustomersService))
    private readonly customersService: CustomersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async create(createTableDto: CreateTableDto) {
    const { number } = createTableDto
    const tableWithNumber = await this.findByTableNumber(number)
    if (tableWithNumber) {
      throw new BadRequestError(`Bàn ăn với số hiệu ${number} đã tồn tại`)
    }

    const token = await this.signTableToken(number)
    const reservationLink = this.createReservationLink(token)

    return this.tableModel.create({ ...createTableDto, token, reservationLink })
  }

  async findAll(qs: PaginationQueryDto & TableQueryDto) {
    const { page, limit, sort: sortQuery, ...filter } = qs
    const sortField = sortQuery?.split('.')?.[0]
    const sort = sortQuery?.split('.')?.[1] === 'desc' ? `-${sortField}` : sortField

    // --------------------- Filter key of nested object ---------------------
    const query = this.tableModel.find(filter).populate({ path: 'customer', select: ['_id', 'code'] })

    if (sort) {
      query.sort(sort)
    }

    if (limit && page) {
      query.skip((page - 1) * limit).limit(limit)
    }

    const [data, totalDocuments] = await Promise.all([query, this.tableModel.countDocuments(filter)])

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
    const table = await this.tableModel.findById(id)
    if (!table) {
      throw new NotFoundError('Bàn không tồn tại')
    }
    return table
  }

  findByTableNumberList(numberList: number[]) {
    return this.tableModel.find({
      number: {
        $in: numberList
      }
    })
  }

  findByTableNumber(number: number) {
    return this.tableModel.findOne({ number })
  }

  findTableByToken(token: string) {
    return this.tableModel.findOne({ token })
  }

  async update(id: string, updateTableDto: UpdateTableDto) {
    const { changeToken, status } = updateTableDto

    const targetTable = await this.tableModel.findOne({ _id: id }).populate({
      path: 'customer',
      select: ['_id']
    })
    if (!targetTable) {
      throw new NotFoundError('Bàn không tồn tại')
    }

    // Nếu thực hiện việc cập nhật số hiệu bàn thì cần ktra tính duy nhất của việc thêm mới bàn đó
    if (updateTableDto.number) {
      const tableWithNumber = await this.findByTableNumber(targetTable.number)
      if (tableWithNumber) {
        throw new BadRequestException(`Bàn ăn với số hiệu ${targetTable.number} đã tồn tại`)
      }
    }

    if (changeToken) {
      const newTableToken = await this.signTableToken(targetTable.number)
      const reservationLink = this.createReservationLink(newTableToken)

      if (status === TableStatus.Available && targetTable.customer !== null) {
        updateTableDto.customer = null
        const customerId = targetTable.customer?._id
        this.customersService.removeRefreshToken(customerId.toString())
      }

      return this.tableModel.findOneAndUpdate(
        { _id: id },
        { ...updateTableDto, reservationLink, token: newTableToken },
        { returnOriginal: false }
      )
    }

    if (status === TableStatus.Available && targetTable.customer !== null) {
      updateTableDto.customer = null
      const customerId = targetTable.customer?._id
      this.customersService.removeRefreshToken(customerId.toString())
    }
    return this.tableModel.findOneAndUpdate({ _id: id }, updateTableDto, { returnOriginal: false })
  }

  async updateByNumber(tableNumber: number, updateTableDto: UpdateTableDto) {
    const table = await this.tableModel.findOne({ number: tableNumber })
    return this.update(table._id.toString(), updateTableDto)
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

  createReservationLink(tableToken: string) {
    return `${this.configService.get<string>('client.baseUrl')}/reservation?token=${tableToken}`
  }
}
