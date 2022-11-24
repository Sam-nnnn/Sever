const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").userModel;
const dotenv = require("dotenv");
dotenv.config();

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET;
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      console.log("進入jwt驗證");
      User.findOne({ _id: jwt_payload._id }, (err, user) => {
        console.log(user);
        console.log(jwt_payload);
        if (err) {
          return done(err, false, { message: "錯誤" });
        }
        if (user) {
          done(null, user, { message: "找到用戶" });
        } else {
          done(null, false, { message: "找到用戶但錯誤" });
        }
      });
    })
  );
};
