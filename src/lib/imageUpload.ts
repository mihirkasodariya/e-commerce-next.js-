// lib/upload.js
import multer from 'multer';
import path from 'path';

// Set up the destination for uploaded files and their filenames
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // save images in the public/uploads folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // add extension to filename
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

export default upload;
