const serverless = require("serverless-http");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const noteRoute = require("./routes").note;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

// connect to DB
mongoose
  .connect(
    "mongodb+srv://mongoDB0205:Samher900205@cluster0.tgyhydp.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connect to Mongo Altas");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/user", authRoute);
app.use(
  "/api/note",
  passport.authenticate("jwt", {
    session: false,
    failureMessage: { error: "錯誤" },
  }),
  noteRoute
);

// app.listen(8080, () => {
//   console.log("Sever running on port " + 8080);
// });

module.exports.handler = serverless(app);
