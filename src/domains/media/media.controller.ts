import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from 'domains/media/multer.options'

@Controller('media')
export class MediaController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions)) // file: key trong object FormData truyền lên (formData.append('file', YOUR_FILE))
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File
  ) {
    const { filename } = file
    return {
      filename
    }
  }
}
