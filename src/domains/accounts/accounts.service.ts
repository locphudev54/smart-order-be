import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Account } from 'domains/accounts/schemas/account.schema'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AccountsService {
  private saltRounds = 10
  constructor(@InjectModel(Account.name) private accountModel: Model<Account>) {}

  async create(createAccountDto: CreateAccountDto) {
    const isExistAccount = await this.accountModel.findOne({ email: createAccountDto.email })
    if (isExistAccount) {
      throw new BadRequestException('Email này đã tồn tại trên hệ thống')
    }

    const hashedPassword = await this.hashPassword(createAccountDto.password)
    return this.accountModel.create({ ...createAccountDto, password: hashedPassword })
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

    const isMatchPassword = await bcrypt.compare(password, account.password)
    return isMatchPassword ? account : null
  }

  update(id: string, updateAccountDto: UpdateAccountDto) {
    const isExist = this.accountModel.findOne({ _id: id })
    if (!isExist) {
      throw new NotFoundException('Tài khoản không tồn tại')
    }
    return this.accountModel.updateOne({ _id: id }, { ...updateAccountDto })
  }

  updateRefreshToken(id: string, refreshToken: string) {
    const isExist = this.accountModel.findOne({ id })
    if (!isExist) {
      throw new NotFoundException('Tài khoản không tồn tại')
    }
    return this.accountModel.updateOne({ _id: id }, { refreshToken })
  }

  async updatePassword(id: string, password: string) {
    const hashedPassword = await this.hashPassword(password)
    return await this.accountModel.updateOne(
      { _id: id },
      {
        password: hashedPassword
      }
    )
  }

  remove(id: string) {
    return this.accountModel.deleteOne({ _id: id })
  }

  // ------------------------- Utils Functions ----------------------------------
  hashPassword(password: string) {
    return bcrypt.hash(password, this.saltRounds)
  }
}
