const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

// Post model
const Post = require("./../../models/Post");
const Profile = require("./../../models/Profile");

const router = express.Router();

const validatePostInput = require("./../../validation/post");

//@route    GET api/posts/test
//@desc     Tests post route
//@access   Public
router.get("/test", (req, res) => res.status(200).json({ msg: "Posts Works" }));

//@route    GET api/posts
//@desc     Get post
//@access   Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.status(200).json(posts))
    .catch(err =>
      res.status(404).json({ nopostfound: "No posts found with that id" })
    );
});

//@route    GET api/posts/:id
//@desc     Get post bi id
//@access   Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.status(200).json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that id" })
    );
});

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

//@route    DELETE api/posts/:id
//@desc     Delete post bi id
//@access   Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Delete
          post.remove().then(() => res.status(200).json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

//@route    POST api/posts/like/:id
//@desc     Like post
//@access   Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id).then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }

          // Add userid to likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.status(200).json(post));
        });
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

//@route    POST api/posts/unlike/:id
//@desc     Unlike post
//@access   Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id).then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not liked yet this post" });
          }

          // Get the remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice it out of the array
          post.likes.splice(removeIndex, 1);

          //Save
          post.save().then(post => res.status(200).json(post));
        });
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
