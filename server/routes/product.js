const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Product } = require("../models/Product");

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
  //destination 어디에 파일이 저장되는지
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  //filename을 어떻게 저장할지
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/image", (req, res) => {
  //가져온 이미지를 저장해주면 된다.
  upload(req, res, (err) => {
    if (err) {
      return req.json({ success: false, err });
    }
    return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename });
  });
});

router.post("/", (req, res) => {
  //가져온 정보들을 DB에 넣어준다.

  const product = new Product(req.body);
  console.log(req.body);

  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/products", (req, res) => {
  //스킵과 리밋의 정보를 받아준 후,
  //리밋이 있다면 지정해준 리밋을 받아주고
  //parseInt는 스트링이라면 숫자로 바꿔주는거
  //리밋이 없다면 20으로 설정 (50, 100도 무관)
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm;

  let findArgs = {};

  for (let key in req.body.filters) {
    //key는 categories아니면 price
    if (req.body.filters[key].length > 0) {
      console.log("key", key);
      if (key === "price") {
        findArgs["price"] = {
          //greater than equal
          //이것보다 크거나 같고
          $gte: req.body.filters[key][0],
          //less than equal
          //이것보다 작거나 같은
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    Product.find(findArgs)
      //몽고db의 메소드 $text $search를 이용해줄것
      .find({ $text: { $search: term } })
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productsInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, productsInfo, postSize: productsInfo.length });
      });
  } else {
    Product.find(findArgs)
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productsInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true, productsInfo, postSize: productsInfo.length });
      });
  }
});

router.get("/products_by_id", (req, res) => {
  //prouctId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져온다.

  let type = req.query.type;
  let productIds = req.query.id;

  if (type === "array") {
    // id = 12345, 67890, 12121 이거를
    // productIds = ['12345'. '67890', '12121'] 이런 식으로 바꿔주기
    let ids = req.query.id.split(",");
    productIds = ids.map((item) => {
      return item;
    });
  }

  Product.find({ _id: { $in: productIds } })
    .populate("writer")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(product);
    });
});

module.exports = router;
