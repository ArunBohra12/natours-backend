// Exports multer upload functions

import multer from 'multer';

const memoryStorage = multer.memoryStorage();

const memoryUpload = multer({ storage: memoryStorage });

export default memoryUpload;
