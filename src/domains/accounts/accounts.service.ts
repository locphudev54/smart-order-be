import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { NotFoundError, UnprocessableEntityError } from 'core/exceptions/errors.exception'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { AccountQueryDto } from 'domains/accounts/dto/account-query.dto'
import { Account, AccountDocument } from 'domains/accounts/schemas/account.schema'
import mongoose, { Model } from 'mongoose'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'

@Injectable()
export class AccountsService {
  private saltRounds = 10
  constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>) {}

  async create(createAccountDto: CreateAccountDto & { _id?: string }) {
    const isExistAccount = await this.accountModel.findOne({ email: createAccountDto.email })
    if (isExistAccount) {
      throw new UnprocessableEntityError([{ field: 'email', message: 'Email này đã tồn tại trên hệ thống' }])
    }

    const hashedPassword = await this.hashPassword(createAccountDto.password)
    const newAccount = await this.accountModel.create({
      ...createAccountDto,
      password: hashedPassword,
      _id: createAccountDto._id ?? new mongoose.Types.ObjectId()
    })

    return {
      _id: newAccount._id,
      email: newAccount.email,
      fullName: newAccount.fullName,
      avatarUrl: newAccount.avatarUrl,
      role: newAccount.role
    }
  }

  async findAll(qs: PaginationQueryDto & AccountQueryDto) {
    const { page, limit, sort: sortQuery, ...filter } = qs
    const sortField = sortQuery?.split('.')?.[0]
    const sort = sortQuery?.split('.')?.[1] === 'desc' ? `-${sortField}` : sortField

    const query = this.accountModel.find(filter)

    if (limit && page) {
      query
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sort)
    }

    const [data, totalDocuments] = await Promise.all([query, this.accountModel.countDocuments(filter)])

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
    const account = await this.accountModel.findOne({ _id: id })
    if (!account) {
      throw new NotFoundError('Tài khoản không tồn tại')
    }
    return this.accountModel.findById(id)
  }

  findByEmail(email: string) {
    return this.accountModel.findOne({ email })
  }

  findByRefreshToken(refreshToken: string) {
    return this.accountModel.findOne({ refreshToken })
  }

  async findAccountByEmailAndPassword({ email, password }: { email: string; password: string }) {
    const account = await this.findByEmail(email)
    if (!account) return null

    const isMatchPassword = await this.comparePassword(password, account.password)
    return isMatchPassword ? account : null
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountModel.findOne({ _id: id })
    if (!account) {
      throw new NotFoundError('Tài khoản không tồn tại')
    }
    return this.accountModel.updateOne({ _id: id }, { ...updateAccountDto })
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return this.accountModel.updateOne({ _id: id }, { refreshToken })
  }

  async updatePassword(id: string, password: string) {
    const hashedPassword = await this.hashPassword(password)
    return this.accountModel.updateOne(
      { _id: id },
      {
        password: hashedPassword
      }
    )
  }

  async remove(id: string) {
    const account = await this.accountModel.findOne({ _id: id })
    if (!account) {
      throw new NotFoundError('Tài khoản không tồn tại')
    }
    return this.accountModel.deleteOne({ _id: id })
  }

  // ------------------------- Utils Functions ----------------------------------
  hashPassword(password: string) {
    return bcrypt.hash(password, this.saltRounds)
  }

  /**
   *
   * @param password mật khẩu ở dạng plain text
   * @param hashedPassword mật khẩu đã được mã hóa
   */
  comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword)
  }
}
