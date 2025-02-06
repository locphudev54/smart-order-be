import { Injectable } from '@nestjs/common'
import { NotFoundError } from 'core/exceptions/errors.exception'
import fs from 'fs'

@Injectable()
export class MediaService {
  deleteFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new NotFoundError('File path không tồn tại')
    }
    fs.unlink(filePath, (error) => {
      if (error) {
        console.log(error)
      }
    })
  }
}
