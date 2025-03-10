import {
  Body,
  Controller,
  Delete,
  Post,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { AuthenticatedUserAccess } from 'core/decorators/authenticated-user-access.decorator'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { BadRequestError } from 'core/exceptions/errors.exception'
import { JwtAuthenticatedAuthGuard } from 'core/guards/jwt-authenticated-auth-.guard'
import { createMediaUrl } from 'core/utils/utils'
import { MediaService } from 'domains/media/media.service'
import { createMulterOptions } from 'domains/media/multer.options'

const LIMIT_UPLOAD_SINGLE_FILE = 4 * 1024 * 1024 // 4MB
const MAX_COUNT_UPLOAD_MULTIPLE_FILE = 10
const LIMIT_UPLOAD_MULTIPLE_FILE = MAX_COUNT_UPLOAD_MULTIPLE_FILE * LIMIT_UPLOAD_SINGLE_FILE

@Controller('media')
@UseGuards(JwtAuthenticatedAuthGuard)
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly configService: ConfigService
  ) {}

  @AuthenticatedUserAccess()
  @Post('/upload/single')
  @ResponseMessage('Upload hình ảnh thành công')
  @UseInterceptors(FileInterceptor('file', createMulterOptions(LIMIT_UPLOAD_SINGLE_FILE))) // file: key trong object FormData truyền lên (formData.append('file', YOUR_FILE))
  uploadSingleFile(
    @Request() req: Request,
    @UploadedFile()
    file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestError('Không nhận được file')
    }

    const folderName = req.headers['folder-name']
    const result = createMediaUrl({
      baseUrl: this.configService.get<string>('server.baseUrl'),
      filename: file.filename,
      folderName
    })
    return {
      result
    }
  }

  @AuthenticatedUserAccess()
  @Post('/upload/multiple')
  @ResponseMessage('Upload danh sách các hình ảnh thành công')
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

  @AuthenticatedUserAccess()
  @Delete()
  deleteSingleFile(@Body() body: { filePath: string }) {
    this.mediaService.deleteFile(body.filePath)
    return 'Xóa file thành công'
  }
}
