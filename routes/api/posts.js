const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

// Post model
const Post = require("./../../models/Post");

const router = express.Router();

const validatePostInput = require("./../../validation/post");

//@route    GET api/posts/test
//@desc     Tests post route
//@access   Public
router.get("/test", (req, res) => res.status(200).json({ msg: "Posts Works" }));

//@route    POST api/posts
//@desc     Create post
//@access   Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost
      .save()
      .then(post => res.status(201).json(post))
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;
