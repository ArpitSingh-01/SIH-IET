import multer from 'multer';
import { Request } from 'express';
import { AppError } from '../utils/errorFormatter';

// In-memory storage engine
const storage = multer.memoryStorage();

// Accept PDF and common image formats
const fileFilter = (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    'application/vnd.ms-powerpoint' // PPT
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new AppError(400, 'Invalid file type. Only PDF, JPG, PNG, and PPTX formats are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB file size limit
  }
});
