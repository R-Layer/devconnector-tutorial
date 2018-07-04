const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const configVars = require("./config/keys");
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

const port = process.env.PORT || 5000;

const app = express();

// General middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    configVars.MONGODB_URI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app.listen(port, () => console.log(`Server running on port ${port}`));
