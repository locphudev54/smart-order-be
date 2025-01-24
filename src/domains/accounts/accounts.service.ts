import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Account } from 'domains/accounts/schemas/account.schema'
import mongoose, { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AccountsService {
  private saltRounds = 10
  constructor(@InjectModel(Account.name) private accountModel: Model<Account>) {}

  async create(createAccountDto: CreateAccountDto & { _id?: string }) {
    const isExistAccount = await this.accountModel.findOne({ email: createAccountDto.email })
    if (isExistAccount) {
      throw new BadRequestException('Email này đã tồn tại trên hệ thống')
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

  findAll() {
    return this.accountModel.find()
  }

  findOne(id: string) {
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
    const isExist = await this.accountModel.findOne({ _id: id })
    if (!isExist) {
      throw new NotFoundException('Tài khoản không tồn tại')
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
    const isExist = await this.accountModel.findOne({ _id: id })
    if (!isExist) {
      throw new NotFoundException('Tài khoản không tồn tại')
    }
    return this.accountModel.deleteOne({ _id: id })
  }

  // ------------------------- Utils Functions ----------------------------------
  hashPassword(password: string) {
    return bcrypt.hash(password, this.saltRounds)
  }

  /**
   *
   * @param password password ở dạng plain text
   * @param hashedPassword password đã được mã hóa
   */
  comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword)
  }
}
