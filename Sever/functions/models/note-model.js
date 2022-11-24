const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  category: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  view: {
    type: Number,
    default: 0,
  },
  // keep: {
  //   total: {
  //     type: Number,
  //     default: 0,
  //   },
  //   // user: {
  //   //   type: [mongoose.Schema.Types.ObjectId],
  //   //   ref: "User",
  //   //   default: [],
  //   // },
  // },
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
