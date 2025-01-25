import { Body, Controller, Delete, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { MediaService } from 'domains/media/media.service'
import { createMulterOptions } from 'domains/media/multer.options'

const LIMIT_UPLOAD_SINGLE_FILE = 4 * 1024 * 1024 // 4MB
const MAX_COUNT_UPLOAD_MULTIPLE_FILE = 10
const LIMIT_UPLOAD_MULTIPLE_FILE = MAX_COUNT_UPLOAD_MULTIPLE_FILE * LIMIT_UPLOAD_SINGLE_FILE

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('/upload/single')
  @UseInterceptors(FileInterceptor('file', createMulterOptions(LIMIT_UPLOAD_SINGLE_FILE))) // file: key trong object FormData truyền lên (formData.append('file', YOUR_FILE))
  uploadSingleFile(
    @UploadedFile()
    file: Express.Multer.File
  ) {
    const result = file.filename
    return {
      result
    }
  }

  @Post('/upload/multiple')
  @UseInterceptors(
    FilesInterceptor('files', MAX_COUNT_UPLOAD_MULTIPLE_FILE, createMulterOptions(LIMIT_UPLOAD_MULTIPLE_FILE))
  )
  async uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    const listFileName: string[] = []
    files.forEach((file) => {
      listFileName.push(file.filename)
    })
    return {
      result: listFileName
    }
  }

  @Delete()
  deleteSingleFile(@Body() body: { filePath: string }) {
    this.mediaService.deleteFile(body.filePath)
    return 'Xóa file thành công'
  }
}
