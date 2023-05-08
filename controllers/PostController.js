const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");



const PostController = {
  // Create a new post
  async create(req, res, next) {
    try {
      let imgPath;
      if (req.file) {
        imgPath = req.file.path;
      }
      const newPost = await Post.create({
        ...req.body,
        img: imgPath,
        userId: req.user._id,
      });
      res.status(201).send({ message: "post created successfully", newPost });
    } catch (error) {
      next(error);
    }
  },

  // Update a post
  async update(req, res) {
    try {
      const updateFields = { 
        ...req.body,
        userId: req.user._id 
      };
      if (req.file) {
        updateFields.img = req.file.path;
      }

      const post = await Post.findByIdAndUpdate(
        req.params._id,
        updateFields,
        { new: true }
      );
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }
      res.send({ message: "post successfully updated", post });
    } catch (error) {
      console.error(error);
    }
  },


  // Delete post
  async delete(req, res) {
    try {
      const post = await Post.findByIdAndDelete(req.params._id);
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }
      await Comment.deleteMany({ post: req.params._id });
      res.send({ message: `Deleted post || ${post.title} ||`, post });
    } catch (error) {
      console.error(error);
    }
  },

  // Find a post by title
  async getByTitle(req, res) {
    try {
      const query = req.params.title;
      const posts = await Post.find({
        title: { $regex: query, $options: "i" },
      });
      if (!posts.length) {
        return res.status(404).send({ message: "No posts found" });
      }
      res.send(posts);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "There was a problem finding the posts" });
    }
  },

  // Find a post by id
  async getById(req, res) {
    try {
      const post = await Post.findById(req.params._id);
      if (!post) {
        return res.status(404).send({ message: "Post not found" });
      }
      res.send(post);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "There was a problem finding the post" });
    }
  },

  // Find with comments
  async getInfo(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const posts = await Post.find()
        .populate({
          path: "userId",
          select: "username"
        })
        .populate({
          path: "commentIds",
          populate: {
            path: "userId",
            select: "username"
          }
        })
        .limit(limit)
        .skip((page - 1) * limit);
      res.send(posts);
    } catch (error) {
      console.error(error);
    }
  },

  //To like a post, only one like per user 
  async like(req, res) {
    try {
      const post = await Post.findById(req.params._id);

      if (post.likes.includes(req.user._id)) {
        return res.status(400).send({ message: "You already liked this post" });
      }

      post.likes.push(req.user._id);
      await post.save();

      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { wishList: req.params._id } },
        { new: true }
      );

      res.send(post);
    } catch (error) {
      console.error(error);

      res.status(500).send({ message: "There was a problem with your like" });
    }
  },

  // Remove like from post, only remove own like
  async unlike(req, res) {
    try {
      const post = await Post.findById(req.params._id);

      if (!post.likes.includes(req.user._id)) {
        return res.status(400).send({ message: "You haven't liked this post yet" });
      }

      const index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);
      await post.save();

      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishList: req.params._id } },
        { new: true }
      );

      res.send(post);
    } catch (error) {
      console.error(error);

      res.status(500).send({ message: "There was a problem with your unlike" });
    }
  }


};

module.exports = PostController;
