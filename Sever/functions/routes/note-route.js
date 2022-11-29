const router = require("express").Router();
const Note = require("../models").noteModel;
const User = require("../models").userModel;
const noteValidation = require("../validation").noteValidation;

router.use((req, res, next) => {
  console.log("有一個進入api的請求");
  next();
});

router.get("/test", (req, res) => {
  const msgObj = {
    message: "Test API is working.",
  };
  return res.json(msgObj);
});

router.post("/", async (req, res) => {
  // 驗證輸入
  const { error } = noteValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let { title, category, text } = req.body;
  let newNote = new Note({
    title,
    category,
    text,
  });
  try {
    await newNote.save();
    res.status(200).send("新文章已儲存");
  } catch (err) {
    res.status(400).send("文章儲存失敗");
  }
});

// user Keep add
router.post("/update/keepAddOrRemove", async (req, res) => {
  let { currentUserId, noteId } = req.body;
  try {
    let user = await User.findOne({ _id: req.body.currentUserId });
    console.log(user);
    console.log(user.keep.includes(noteId) === true);
    if (user.keep.includes(noteId)) {
      let indexnum = user.keep.indexOf(noteId);
      console.log(indexnum);
      user.keep.splice(indexnum, 1);
      console.log(user.keep);
      await user.save();
      res.status(200).send("刪除成功");
      console.log(user);
    } else {
      user.keep.push(noteId);
      console.log(user.keep);
      await user.save();
      res.status(200).send("儲存成功");
      console.log(user);
    }
  } catch (err) {
    res.status(200).send("儲存失敗");
  }
});

module.exports = router;
