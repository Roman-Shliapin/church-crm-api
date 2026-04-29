import mongoose from 'mongoose'

const reactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['pray', 'heart', 'thumbs_up', 'dove', 'star'], required: true },
}, { _id: false })

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        authorId: { type: String },
        authorName: { type: String },
        reactions: { type: [reactionSchema], default: [] },
        pinned: { type: Boolean, default: false },
        expiresAt: { type: Date, default: null },
    },
    { timestamps: true, collection: 'posts' }
);

postSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true })

export default mongoose.model('Post', postSchema)