// cloudinary.service.ts

import { Injectable } from '@nestjs/common'
import { v2, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'
import { Request } from 'express'

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File, req: Request): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const folderName = req.headers['folder-name'] ?? 'tmp'

    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(
          {
            resource_type: 'auto',
            folder: folderName as string
          },
          (error, result) => {
            if (error) {
              return reject(error)
            }
            resolve(result)
          }
        )
        .end(file.buffer)
    })
  }
  async uploadFiles(files: Express.Multer.File[], req: Request) {
    const urls = await Promise.all(
      files.map(async (file): Promise<string> => {
        const { secure_url } = await this.uploadFile(file, req)
        return secure_url
      })
    )
    return urls
  }
}
