const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require("../middleware/auth");
const { Product } = require("../models/Product");

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

router.post('/uploadProduct', auth, (req, res) => {
  // 클라이언트 가져온 정보를 DB에 저장
  const product = new Product(req.body);

  product.save((err) => {
    if(err) return res.send(400).json({ success: false })
    return res.status(200).json({ success: true })
  });
})

router.post('/getProducts', auth, (req, res) => {

  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip)
  let term = req.body.searchTerm;

  let findArgs = {};

  for(let key in req.body.filters) {
    // key = continents, price / req.body.filters[key] = [5, 7], [2] 배열 데이터
    if(req.body.filters[key].length > 0) {
      if(key === "price") {
        findArgs[key] = {
          // Greater than equal
          $gte: req.body.filters[key][0],
          // Less than equal
          $lte: req.body.filters[key][1]
        }
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if(term) {
    Product.find(findArgs)
      // 검색어랑 동일한 결과만 가져온다
      // .find({ $text: { $search: term } })
      // sql like과 동일, 검색어가 포함된 title을 가진 상품 리스트를 다 가져온다
      .find({ "title": { '$regex': term } })
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      // exec()은 앞에 작성한 query를 실행하고 promise를 반환한다, Will execute returning a promise
      .exec((err, products) => {
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true, products, postSize: products.length })
      })
  } else {
    Product.find(findArgs)
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      // exec()은 앞에 작성한 query를 실행하고 promise를 반환한다, Will execute returning a promise
      .exec((err, products) => {
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true, products, postSize: products.length })
      })
  }
})

router.get('/product_by_id', (req, res) => {

  // productId를 이용해서 product DB에서 productId가 같은 상품 데이터를 가져온다

  let type = req.query.type
  let productId = req.query.id

  Product.find({ _id: productId })
    .populate('writer')
    .exec((err, product) => {
      if(err) return res.status(400).send(err)
      return res.status(200).send({ success: true, product })
    })

})

module.exports = router;
