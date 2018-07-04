const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema creation
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  avatar: {
    type: String
  }
});

const User = mongoose.model("users", userSchema);

module.exports = User;
