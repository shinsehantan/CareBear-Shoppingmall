const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Payment } = require("../models/Payment");

const { auth } = require("../middleware/auth");
const async = require("async");

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
      success: true,
    });
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

router.post("/addToCart", auth, (req, res) => {
  //먼저  User Collection에 해당 유저의 정보를 가져오기
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인

    let duplicate = false;
    userInfo.cart.forEach((item) => {
      if (item.id === req.body.productId) {
        duplicate = true;
      }
    });

    //상품이 이미 있을때
    if (duplicate) {
      User.findOneAndUpdate({ _id: req.user._id, "cart.id": req.body.productId }, { $inc: { "cart.$.quantity": 1 } }, { new: true }, (err, userInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).send(userInfo.cart);
      });
    }
    //상품이 이미 있지 않을때
    else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: req.body.productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          res.status(200).send(userInfo.cart);
        }
      );
    }
  });
});

// router.get("/removeFromCart", auth, (req, res) => {
//   //우선 카트 안에 내가 지우려고 한 상품을 지워주기
//   User.findOneAndUpdate(
//     { _id: req.user_id },
//     {
//       $pull: { cart: { id: req.query.id } },
//     },
//     { new: true },
//     (err, userInfo) => {
//       let cart = userInfo.cart;
//       let array = cart.map((item) => {
//         return item.id;
//       });

//       //product collection에서 현재 남아있는 상품들의 정보를 다시 가져오기

//       //하나를 지우고 남은 아이디 121212 343434를
//       //productIds=['121212','343434']형태로 바꿔주는 작업

//       Product.find({ _id: { $in: array } })
//         .populate("writer")
//         .exec((err, productInfo) => {
//           return res.status(200).json({
//             productInfo,
//             cart,
//           });
//         });
//     }
//   );
// });

router.get("/removeFromCart", auth, (req, res) => {
  //먼저 cart안에 내가 지우려고 한 상품을 지워주기
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: { cart: { id: req.query.id } },
    },
    { new: true },
    (err, userInfo) => {
      let cart = userInfo.cart;
      let array = cart.map((item) => {
        return item.id;
      });

      //product collection에서  현재 남아있는 상품들의 정보를 가져오기

      //productIds = ['5e8961794be6d81ce2b94752', '5e8960d721e2ca1b3e30de4'] 이런식으로 바꿔주기
      Product.find({ _id: { $in: array } })
        .populate("writer")
        .exec((err, productInfo) => {
          return res.status(200).json({
            productInfo,
            cart,
          });
        });
    }
  );
});

router.post("/successBuy", auth, (req, res) => {
  // 1. User Collection안에 history필드 안에 간단한 결제 정보 넣어주기
  let history = [];
  let transactionData = {};

  //다른 정보는 모두 리덕스, 카트디테일에 있고
  //paymentId는 넘겨준 paymentData 안에 있음
  console.log("user.js", req.body);

  req.body.cartDetail.forEach((item) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.title,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentId,
    });
  });

  // 2. Payment Collection 안에 자세한 결제 정보 넣어주기
  transactionData.user = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    //미들웨어 auth를 통해 오는 정보들
  };

  transactionData.data = req.body.paymentData;
  //카트 페이지에서 paymentData에 paypal에서 넘어온 모든 결제정보를 넣어서 보내줬기 때문에 이렇게만 해주면 됨.
  transactionData.product = history;

  //history 정보 저장
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { history: history }, $set: { cart: [] } },
    //넣어준다. 어디에 넣어주는지 {history}, 변화시킬 정보(카트 비우기)
    { new: true },
    //이제 업데이트 된 정보들은 아래 user로 들어가게 됨.
    (err, user) => {
      if (err) return res.json({ success: false, err });

      //payment에 모든 transaction data를 저장
      const payment = new Payment(transactionData);
      payment.save((err, doc) => {
        if (err) return res.json({ success: false, err });

        // 3. Product Collection 안에 있는 sold 필드 정보 업데이트 시켜주기

        // 우선 상품당 몇 개를 샀는지 알아야 함
        // 위 payment의 모든 정보가 doc에 들어있으니,
        // 새로운 products 어레이에 doc.product에 있는 구매한 상품의 아이디, 개수를 넣는 것
        let products = [];
        doc.product.forEach((item) => {
          products.push({ id: item.id, quantity: item.quantity });
        });

        // 상품별로 팔린 개수만큼 Product 모델의 sold 필드를 업데이트 시켜주기

        async.eachSeries(
          products,
          (item, callback) => {
            Product.update(
              { _id: item.id },
              {
                $inc: {
                  sold: item.quantity,
                },
              },
              { new: false },
              callback
            );
          },
          (err) => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({
              success: true,
              cart: user.cart,
              cartDetail: [],
            });
          }
        );
      });
    }
  );
});

module.exports = router;
