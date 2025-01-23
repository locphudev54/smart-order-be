import { Controller, Get } from '@nestjs/common'
import { Public } from 'core/decorators/public.decorator'

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello() {
    return 'Xin chào các bạn'
  }
}
