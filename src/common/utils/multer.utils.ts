import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const multerOptions = (allowedTypes: string[]) => ({
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    if (!allowedTypes.includes(file.mimetype))
      throw new BadRequestException('Not allowed file type');
    cb(null, true);
  },
  storage: diskStorage({}),
});
