import multer from "multer";
import path from 'path';
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './src/uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storageConfig });

export default upload;