const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const router = express.Router();
//@route    GET api/profile/test
//@desc     Tests profile route
//@access   Public
router.get("/test", (req, res) =>
  res.status(200).json({ msg: "Profile Works" })
);

module.exports = router;
