import { BadRequestException } from '@nestjs/common'
import { extname } from 'path'

export const imageFileFilter = (req, file: Express.Multer.File, callback) => {
  // Danh sách MIME type hợp lệ
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(new BadRequestException('Chỉ được upload file ảnh (jpg, jpeg, png, gif, webp)'), false)
  }
  callback(null, true)
}

export const editFileName = (req, file: Express.Multer.File, callback) => {
  const name = file.originalname.split('.')[0]
  const fileExtName = extname(file.originalname)
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('')
  callback(null, `${name}-${randomName}${fileExtName}`)
}
