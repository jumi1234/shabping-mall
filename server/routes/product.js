const express = require('express');
const router = express.Router();
const multer = require('multer');


//=================================
//             Product
//=================================

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.png' || ext !== '.jpg') {
      return cb(res.status(400).end('only png, jpg is allowed'), false);
    }
    cb(null, true)
  }
})

var upload = multer({
  storage: storage
}).single("file")

router.post("/uploadImage", (req, res) => {

  // view에서 이미지 가져와서 node 서버에 저장 with multer library
  upload(req, res, err => {
    if(err) return res.json({ success: false, err })
    return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename })
  })
})

module.exports = router;
