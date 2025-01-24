import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { AccountsService } from './accounts.service'
import { CreateAccountDto } from './dto/create-account.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { Public } from 'core/decorators/public.decorator'
import { ValidateMongoIdPipe } from 'core/pipes/validate-mongo-id.pipe'

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Public()
  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto)
  }

  @Public()
  @Get()
  findAll() {
    return this.accountsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.accountsService.findOne(id)
  }

  @Public()
  @Patch(':id')
  update(@Param('id', ValidateMongoIdPipe) id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateAccountDto)
  }

  @Delete(':id')
  remove(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.accountsService.remove(id)
  }
}
