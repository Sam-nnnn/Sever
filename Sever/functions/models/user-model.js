const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  keep: {
    type: [String],
    default: [],
  },
});

//mongoose schema middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, callBack) {
  bcryptjs.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return callBack(err, isMatch);
    }
    callBack(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
