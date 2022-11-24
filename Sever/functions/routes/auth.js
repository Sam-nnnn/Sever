const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").userModel;
const Note = require("../models").noteModel;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

router.use((req, res, next) => {
  console.log("A request is coming  in to auth.js");
  next();
});

router.get("/textAPI", (req, res) => {
  const msgObj = {
    message: "Text API is working.",
  };
  return res.json(msgObj);
});

// register post
router.post("/register", async (req, res) => {
  // check the validation of data
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // check if the user exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email已經被註冊");
  }

  //register the user
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      msg: "success",
      savedObject: savedUser,
    });
  } catch (err) {
    res.status(400).send("註冊失敗");
  }
});

// login post
router.post("/login", (req, res) => {
  // ckeck ths validation of data
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      return res.status(400).send(err);
    }
    if (!user) {
      res.status(401).send("Email錯誤");
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) {
          return res.status(400).send(err);
        }
        if (isMatch) {
          const tokenObject = { _id: user._id, email: user.email };
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
          res.send({ success: true, token: "JWT " + token, user });
        } else {
          console.log(err);
          res.status(401).send("密碼錯誤");
        }
      });
    }
  });
});

// all user view note
router.get("/all", async (req, res) => {
  const data = await Note.find({});
  if (data) {
    res.send(data);
  }
});

module.exports = router;
