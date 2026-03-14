import { Controller, Post, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { AuthenticatedUserAccess } from 'core/decorators/authenticated-user-access.decorator'
import { ResponseMessage } from 'core/decorators/response-message.decorator'
import { JwtAuthenticatedAuthGuard } from 'core/guards/jwt-authenticated-auth-.guard'
import { CloudinaryService } from 'domains/cloudinary/cloudinary.service'
import { MediaService } from 'domains/media/media.service'
import { createMulterOptions } from 'domains/media/multer.options'
import { Request as RequestType } from 'express'

const LIMIT_UPLOAD_SINGLE_FILE = 4 * 1024 * 1024 // 4MB
const MAX_COUNT_UPLOAD_MULTIPLE_FILE = 10
const LIMIT_UPLOAD_MULTIPLE_FILE = MAX_COUNT_UPLOAD_MULTIPLE_FILE * LIMIT_UPLOAD_SINGLE_FILE

@Controller('media')
@UseGuards(JwtAuthenticatedAuthGuard)
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService
  ) {}
  // --------------------------------------- Upload Cloudinary ---------------------------------------
  @AuthenticatedUserAccess()
  @Post('upload/single')
  @ResponseMessage('Upload hình ảnh thành công')
  @UseInterceptors(FileInterceptor('file', createMulterOptions(LIMIT_UPLOAD_SINGLE_FILE)))
  async uploadImage(@UploadedFile() file: any, @Request() req: RequestType) {
    const res = await this.cloudinaryService.uploadFile(file, req)
    return {
      result: res.secure_url
    }
  }

  @AuthenticatedUserAccess()
  @Post('upload/multiple')
  @ResponseMessage('Upload danh sách hình ảnh thành công')
  @UseInterceptors(
    FilesInterceptor('files', MAX_COUNT_UPLOAD_MULTIPLE_FILE, createMulterOptions(LIMIT_UPLOAD_MULTIPLE_FILE))
  )
  async uploadMultipleFiles(@UploadedFiles() files: any[], @Request() req: RequestType) {
    const urls = await this.cloudinaryService.uploadFiles(files, req)
    return {
      result: urls
    }
  }

  // --------------------------------------- Upload Local ---------------------------------------
  // @AuthenticatedUserAccess()
  // @Post('/upload/single')
  // @ResponseMessage('Upload hình ảnh thành công')
  // @UseInterceptors(FileInterceptor('file', createMulterOptions(LIMIT_UPLOAD_SINGLE_FILE))) // file: key trong object FormData truyền lên (formData.append('file', YOUR_FILE))
  // uploadSingleFile(
  //   @Request() req: Request,
  //   @UploadedFile()
  //   file: Express.Multer.File
  // ) {
  //   if (!file) {
  //     throw new BadRequestError('Không nhận được file')
  //   }

  //   const folderName = req.headers['folder-name']
  //   const result = createMediaUrl({
  //     baseUrl: this.configService.get<string>('server.baseUrl'),
  //     filename: file.filename,
  //     folderName
  //   })
  //   return {
  //     result
  //   }
  // }

  // @AuthenticatedUserAccess()
  // @Post('/upload/multiple')
  // @ResponseMessage('Upload danh sách các hình ảnh thành công')
  // @UseInterceptors(
  //   FilesInterceptor('files', MAX_COUNT_UPLOAD_MULTIPLE_FILE, createMulterOptions(LIMIT_UPLOAD_MULTIPLE_FILE))
  // )
  // async uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   const listFileName: string[] = []
  //   files.forEach((file) => {
  //     listFileName.push(file.filename)
  //   })
  //   return {
  //     result: listFileName
  //   }
  // }

  // @AuthenticatedUserAccess()
  // @Delete()
  // deleteSingleFile(@Body() body: { filePath: string }) {
  //   this.mediaService.deleteFile(body.filePath)
  //   return 'Xóa file thành công'
  // }
}
