const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

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

module.exports = router;
