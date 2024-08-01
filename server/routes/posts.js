const router = require("express").Router();
const Post = require("../models/Post");
const verify = require("../verifyToken"); // Correct path

// Create a new post
router.post("/", verify, async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id,
  });
  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// Read all posts
router.get("/", verify, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id });
    res.json(posts);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// Read single posts
router.get("/:postId", verify, async (req, res) => {
  try {
    const posts = await Post.findOne({
      _id: req.params.postId,
      author: req.user._id,
    });
    res.json(posts);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// Update a post
router.patch("/:postId", verify, async (req, res) => {
  try {
    const updatedPost = await Post.updateOne(
      { _id: req.params.postId, author: req.user._id },
      { $set: { title: req.body.title, content: req.body.content } }
    );
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

// Delete a post
router.delete("/:postId", verify, async (req, res) => {
  try {
    const removedPost = await Post.deleteOne({
      _id: req.params.postId,
      author: req.user._id,
    });
    res.json(removedPost);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

module.exports = router;
