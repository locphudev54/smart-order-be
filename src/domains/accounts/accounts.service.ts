import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { BadRequestError, NotFoundError, UnprocessableEntityError } from 'core/exceptions/errors.exception'
import { PaginationQueryDto } from 'core/query-string-dtos/pagination-query.dto'
import { AccountQueryDto } from 'domains/accounts/dto/account-query.dto'
import { Account, AccountDocument } from 'domains/accounts/schemas/account.schema'
import { Model } from 'mongoose'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import crypto from 'crypto'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs'
import path from 'path'

@Injectable()
export class AccountsService {
  private saltRounds = 10
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private readonly configService: ConfigService
  ) {}

  async create(createAccountDto: CreateAccountDto & { _id?: string }) {
    const isExistAccount = await this.accountModel.findOne({ email: createAccountDto.email })
    if (isExistAccount) {
      throw new UnprocessableEntityError([{ field: 'email', message: 'Email này đã tồn tại trên hệ thống' }])
    }

    const hashedPassword = await this.hashPassword(createAccountDto.password)
    const newAccount = await this.accountModel.create({
      ...createAccountDto,
      password: hashedPassword,
      _id: createAccountDto._id
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

    const decryptedPassword = this.decryptPassword(password)
    const isMatchPassword = await this.comparePassword(decryptedPassword, account.password)

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

  decryptPassword(encryptedPassword: string): string | null {
    try {
      const privateKey = fs.readFileSync(path.join(process.cwd(), 'src/config/private-key.pem'))

      const password = crypto
        .privateDecrypt(
          {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha1'
          },
          Buffer.from(encryptedPassword, 'base64')
        )
        .toString()

      if (!password) {
        throw new BadRequestError('Giải mã password thất bại')
      }

      return password
    } catch (error: any) {
      throw new BadRequestError(error.message ?? 'Giải mã password thất bại')
    }
  }
}
