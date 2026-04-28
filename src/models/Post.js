import mongoose from 'mongoose'


const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: String },
    authorName: { type: String },
}, { timestamps: true, collection: 'posts' }
);

export default mongoose.model('Post', postSchema);