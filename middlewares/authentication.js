const User = require('../models/user');
const Post = require('../models/post')
const Comment = require ('../models/comment')
const jwt = require('jsonwebtoken');
require("dotenv").config();

const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: payload._id, tokens: token });
        if (!user) {
            return res.status(401).send({ message: 'You are not authorized' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error, message: 'There was a problem with the tokenn' })
    }
}

const isAdmin = async (req, res, next) => {
    const admins = ['admin', 'superadmin'];
    if (!admins.includes(req.user.role)) {
        return res.status(403).send({
            message: 'You do not have permission'
        });
    }
    next();
}

const isAuthor = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params._id);
        if (!post) { // si post es null, significa que no se encontró ningún post
            return res.status(404).send({ message: 'Post not found' });
        }
        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'This is not your post' });
        }
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error, message: 'There was a problem verifying the authorship of the post' })
    }

}

const isAuthorCom = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params._id);
        if (!comment) { // si comment es null, significa que no se encontró ningún comment
            return res.status(404).send({ message: 'Comment not found' });
        }
        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'This is not your comment' });
        }
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error, message: 'There was a problem verifying the authorship of the comment' })
    }

}

module.exports = { authentication, isAdmin, isAuthor, isAuthorCom }