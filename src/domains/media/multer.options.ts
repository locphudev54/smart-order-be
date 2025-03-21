import { imageFileFilter } from 'domains/media/media-upload.utils'

export const createMulterOptions = (limitFileSize: number) => ({
  limits: {
    fileSize: limitFileSize
  },
  fileFilter: imageFileFilter
  // Uncommnet nếu sử dụng upload file local
  // storage: diskStorage({
  //   destination: (req, file: any, cb: any) => {
  //     const folderName = req.headers['folder-name'] ?? 'tmp'
  //     const uploadPath = `${process.env.MULTER_DEFAULT_DEST}/${folderName}`
  //     if (!fs.existsSync(uploadPath)) {
  //       fs.mkdirSync(uploadPath, { recursive: true })
  //     }
  //     cb(null, uploadPath)
  //   },
  //   filename: editFileName
  // })
})
