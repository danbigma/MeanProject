const multer = require("multer");
const moment = require("moment");

const DATE_FORMAT = "DDMMYYYY-HHmmss_SSS";

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');  
    },
    filename(req, file, cb) {
        const date = moment().format(DATE_FORMAT);
        cb(null, date + "-" + file.originalname)    
    }
});

const fileFilter = (req, file, cb) => {
    if(file.minetype === "image/png" || file.minetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const limits = {
    fileSize: 1024 * 1024 * 5
}

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});