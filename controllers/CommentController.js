const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user")

const CommentController = {

  // Create comment
  async create(req, res) {
    try {
      let imgPath;
      if (req.file) {
        imgPath = req.file.path;
      }
      const comment = await Comment.create({
        body: req.body.body,
        userId: req.user._id,
        postId: req.params._id,
        img: imgPath
      });

      await Post.findByIdAndUpdate(req.params._id,
        { $push: { commentIds: comment._id } })

      res.status(201).send({ message: "Comment created successfully", comment });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: `There was a problem creating the comment: ${error.message}` });
    }
  },


  // Get comment
  async getAll(req, res) {
    try {
      const comment = await Comment.find();
      res.status(200).send({ message: "We finded all this comments", comment });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: `There was a problem getting the comment: ${error.message}` });
    }
  },

  // Update comment
  async update(req, res) {
    try {
      const updateFields = { 
        ...req.body,
        userId: req.user._id 
      };
      if (req.file) {
        updateFields.img = req.file.path;
      }
  
      const comment = await Comment.findByIdAndUpdate(
        req.params._id,
        updateFields,
        { new: true }
      );
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }
      res.send({ message: "Comment updated successfully", comment });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: `There was a problem updating the comment: ${error.message}` });
    }
  },  

  // Delete comment
  async delete(req, res) {
    try {
      const comment = await Comment.findByIdAndDelete(req.params._id);
      await Post.findByIdAndUpdate(comment.postId, { $pull: { commentIds: comment._id } });
      if (!comment) {
        return res.status(404).send({ message: "Comment not found" });
      }
      res.send({ message: "Comment deleted", comment });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: `There was a problem deleting the comment: ${error.message}` });
    }
  },

  //To like a comment, only one like per user 
  async like(req, res) {
    try {
      const comment = await Comment.findById(req.params._id);

      if (comment.likesCom.includes(req.user._id)) {
        return res.status(400).send({ message: "You already liked this comment" });
      }

      comment.likesCom.push(req.user._id);
      await comment.save();

      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { wishListCom: req.params._id } },
        { new: true }
      );

      res.send(comment);
    } catch (error) {
      console.error(error);

      res.status(500).send({ message: "There was a problem with your like" });
    }
  },

  // Remove like from comment, only remove own like
  async unlike(req, res) {
    try {
      const comment = await Comment.findById(req.params._id);

      if (!comment.likesCom.includes(req.user._id)) {
        return res.status(400).send({ message: "You haven't liked this comment yet" });
      }

      const index = comment.likesCom.indexOf(req.user._id);
      comment.likesCom.splice(index, 1);
      await comment.save();

      await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishListCom: req.params._id } },
        { new: true }
      );

      res.send(comment);
    } catch (error) {
      console.error(error);

      res.status(500).send({ message: "There was a problem with your unlike" });
    }
  },


};

module.exports = CommentController;