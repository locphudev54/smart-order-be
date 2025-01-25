import { Injectable, NotFoundException } from '@nestjs/common'
import fs from 'fs'

@Injectable()
export class MediaService {
  deleteFile(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File path không tồn tại')
    }
    fs.unlink(filePath, (error) => {
      if (error) {
        console.log(error)
      }
    })
  }
}
