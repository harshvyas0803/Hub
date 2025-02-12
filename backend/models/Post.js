import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],      // Users who liked
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],   // Users who disliked
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: String,
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', PostSchema);
export default Post;
