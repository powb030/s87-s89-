const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { verify } = require("../auth");

// GET /posts - public
router.get("/", postController.getAllPosts);

// GET /posts/:id - public
router.get("/:id", postController.getByIdPost);

// POST /posts - private
router.post("/", verify, postController.createPost);

// PUT /posts/:id - private (owner only)
router.put("/:id", verify, postController.updatePost);

// DELETE /posts/:id - private (owner or admin)
router.delete("/:id", verify, postController.deletePost);

// POST /posts/:id/comments - private
router.post("/:id/comments", verify, postController.addComment);

module.exports = router;