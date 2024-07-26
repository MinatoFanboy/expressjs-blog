const express = require('express');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    
    res.send(file);
});

router.post('/uploadMultiple', upload.array('myFiles', 2), (req, res, next) => {
    const files = req.files;

    if (!files) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error);
    }

    res.send(files);
})

module.exports = router;
