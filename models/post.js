const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter a title"],
    },
    body: {
        type: String,
        required: [true, "Please enter a post content"],
    },
    userId: {
        type: ObjectId,
        ref: 'User'
    },
   
    commentIds: [{ type: ObjectId, ref: 'Comment' }],
    likes: [{ type: ObjectId, ref: 'User' }],
    img: String,

}, { timestamps: true });




const Post = mongoose.model('Post', PostSchema);

module.exports = Post;