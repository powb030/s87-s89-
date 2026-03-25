const Post = require("../models/Post");
const { errorHandler } = require("../auth");

// POST /posts - Create a post (logged-in users only)
module.exports.createPost = (req, res) => {
    const { title, content } = req.body;

    if (!title) {
        return res.status(400).send({ error: "Title is required" });
    } else if (!content) {
        return res.status(400).send({ error: "Content is required" });
    } else {
        let newPost = new Post({
            title,
            content,
            author: req.user.userName
        });
        return newPost.save()
            .then(() => res.status(201).send({ message: "Post created successfullya", newPost }))
            .catch(err => errorHandler(err, req, res));
    }
};

// GET /posts - Get all posts (public)
module.exports.getAllPosts = (req, res) => {
    return Post.find()
        .populate("author", "username email")
        .sort({ createdAt: -1 })
        .then(posts => res.status(200).send({ posts }))
        .catch(err => errorHandler(err, req, res));
};

// GET /posts/:id - Get single post (public)
module.exports.getByIdPost = (req, res) => {
    return Post.findById(req.params.id)
        .then(post => {              
            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }
            return res.status(200).send({ post });
        })
        .catch(err => errorHandler(err, req, res));
};

// PUT /posts/:id - Update own post
module.exports.updatePost = (req, res) => {
    const { title, content } = req.body;
    return Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }
            if (post.author !== req.user.userName) { 
                return res.status(403).send({ error: "Not authorized to update this post" });
            }
            post.title = title || post.title;
            post.content = content || post.content;
            return post.save()
                .then(() => res.status(200).send({ message: "Post updated successfully", post }))
                .catch(err => errorHandler(err, req, res));
        })
        .catch(err => errorHandler(err, req, res));
};

// DELETE /posts/:id - Delete own post or admin deletes any
module.exports.deletePost = (req, res) => {
    return Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }
            const isOwner = post.author === req.user.userName;
            const isAdmin = req.user.isAdmin;
            if (!isOwner && !isAdmin) {
                return res.status(403).send({ error: "Not authorized to delete this post" });
            }
            return Post.findByIdAndDelete(req.params.id)
                .then(() => res.status(200).send({ message: "Post deleted successfully"}))
                .catch(err => errorHandler(err, req, res));
        })
        .catch(err => errorHandler(err, req, res));
};

// POST /posts/:id/comments - Add comment (logged-in users only)
module.exports.addComment = (req, res) => {
    const { comment } = req.body;
    if (!comment) {
        return res.status(400).send({ error: "Comment is required" });
    }
    return Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                return res.status(404).send({ error: "Post not found" });
            }
            post.comments.push({
                userName: req.user.userName,
                comment
            });
            return post.save()
                .then(() => res.status(201).send({ message: "Comment added successfully", post }))
                .catch(err => errorHandler(err, req, res));
        })
        .catch(err => errorHandler(err, req, res));
};