import fs from 'fs'
import { diskStorage } from 'multer'
import { editFileName, imageFileFilter } from 'domains/media/file-upload.utils'

export const multerOptions = {
  limits: {
    fileSize: 4 * 1024 * 1024 // 4MB
  },
  fileFilter: imageFileFilter,
  storage: diskStorage({
    destination: (req, file: any, cb: any) => {
      const folderName = req.headers['folder-name'] ?? 'tmp'
      const uploadPath = `./upload/${folderName}`
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
      }
      cb(null, uploadPath)
    },
    filename: editFileName
  })
}
