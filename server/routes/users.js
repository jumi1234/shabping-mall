const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product")
const { Payment } = require("../models/Payment")

const { auth } = require("../middleware/auth");
const async = require('async');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history,
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res) => {

  // 먼저 user collection에 해당 유저의 정보를 가져오기
  User.findOne({ _id: req.user._id },
    (err, userInfo) => {

    // 가져온 정보에서 카트에 넣으려는 상품이 기존 카트에 존재하는지 확인
    let duplicate = false;
    userInfo.cart.forEach((item) => {
      if(item.id === req.body.productId) {
        duplicate = true;
      }
    })

    // 카트에 상품이 존재할 때
    if(duplicate) {
      User.findOneAndUpdate(
        { _id: req.user._id, "cart.id": req.body.productId },
        { $inc: { "cart.$.quantity": 1 } },
        // 위 조건에 맞는 결과값을 가져오기 위한 option
        { new: true },
        (err, userInfo) => {
          if(err) return res.status(400).json({ success: false, err })
          return res.status(200).send(userInfo.cart)
        }
      )
    // 카트에 상품이 없을 때
    } else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: req.body.productId,
              quantity: 1,
              data: Date.now()
            }
          }
        },
        { new: true },
        (err, userInfo) => {
          if(err) return res.status(400).json({ success: false, err })
          res.status(200).send(userInfo.cart)
        }
      )
    }

  })

});

router.get('/removeFromCart', auth, (req, res) => {
  // 먼저 cart 안에서 내가 지우려고 한 상품 지우기
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      "$pull":
        { "cart": { "id": req.query.id } }
    },
    // update한 후의 값을 가져오기 위한 옵션
    { new: true },
    (err, userInfo) => {
      let cart = userInfo.cart
      let array = cart.map(item => {
        return item.id
      })

  // product colleciton에서 현재 남아있는 상품들의 정보를 가져오기

  // productIds = ['123424', '4334', '23323'] 이런 식으로 바꿔주기

    Product.find({ '_id': { $in: array } })
      .populate('writer')
      .exec((err, productInfo) => {
        return res.status(200).json({
          productInfo,
          cart
        })
      })
  })
})

router.post('/successBuy', auth, (req, res) => {

  // 1. User collection 안에 history 필드 안에 간단한 정보 넣어주기
  let history = [];
  let transactionData = {};

  req.body.cartDetail.forEach((item) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.title,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentID
    })
  });

  // 2. Payment collection 안에 자세한 결제 정보들 넣어주기
  transactionData.user = {
    // auth 미들웨어 통해 가져오는 user 정보들
    id: req.user._id,
    name: req.user.name,
    email: req.user.emal
  }

  transactionData.data = req.body.paymentData

  transactionData.product = history

  // history 정보 저장
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { history: history }, $set: { cart: [] } },
    // 업데이트한 결과 가져오기 위한 옵션
    { new: true },
    (err, user) => {
      if(err) return res.json({ success: false, err })

      // payment에 transactionData 저장
      const payment = new Payment(transactionData)
      payment.save((err, doc) => {
        if(err) return res.json({ success: false, err })

        // 3. Product collection 안에 있는 sold 필드 정보 업데이트 하기

        // 상품 당 몇 개의 quantity를 샀는지
        let products = [];
        doc.product.forEach(item => {
          products.push(
            { id: item.id, quantity: item.quantity }
          )
        });

        async.eachSeries(products, (item, callback) => {
          Product.update(
            { _id: item.id },
            { $inc: {
                "sold": item.quantity
              }
            },
            { new: false },
            callback

          )
        }, (err) => {
            if(err) return res.status(400).json({ success: false, err })
            res.status(200).json({
              success: true,
              cart: user.cart,
              cartDetail: []
            })

        })

      })
    }

  )

})

module.exports = router;
